import type {
  CreateRendererOptions,
  GraphRenderer,
  RendererStatus,
} from './types'

type CosmosConfig = Record<string, unknown>

export type CosmosGraphLike = {
  ready: Promise<void>
  setPointPositions(values: Float32Array): void
  setPointColors(values: Float32Array): void
  setPointSizes(values: Float32Array): void
  setPointShapes(values: Float32Array): void
  setLinks(values: Float32Array): void
  setLinkColors(values: Float32Array): void
  setLinkStyles(values: Float32Array): void
  setConfigPartial(config: CosmosConfig): void
  render(simulationAlpha?: number, transitionDuration?: number): void
  zoomToPointByIndex(
    index: number,
    duration?: number,
    scale?: number,
    canZoomOut?: boolean,
    enableSimulation?: boolean,
  ): void
  fitView(
    duration?: number,
    padding?: number,
    enableSimulation?: boolean,
  ): void
  pause(): void
  destroy(): void
}

export type CosmosGraphConstructor = new (
  container: HTMLDivElement,
  config: CosmosConfig,
) => CosmosGraphLike

const MAX_DRAWING_BUFFER_PIXELS = 2_000_000

export function getCappedPixelRatio(
  width: number,
  height: number,
  devicePixelRatio: number,
): number {
  const safeWidth = Math.max(width, 1)
  const safeHeight = Math.max(height, 1)
  const pixelBudgetRatio = Math.sqrt(
    MAX_DRAWING_BUFFER_PIXELS / (safeWidth * safeHeight),
  )
  return Math.max(
    0.75,
    Math.min(devicePixelRatio || 1, 1.5, pixelBudgetRatio),
  )
}

export async function createGraphRendererWithConstructor(
  GraphConstructor: CosmosGraphConstructor,
  options: CreateRendererOptions,
): Promise<GraphRenderer> {
  const {
    container,
    projection,
    onSelectNode,
    onStatus,
  } = options
  let reducedMotion = options.reducedMotion
  let destroyed = false
  let hasInitialSelection = false
  let graph: CosmosGraphLike | undefined

  const announce = (status: RendererStatus, message: string): void => {
    if (!destroyed || status === 'closed') onStatus(status, message)
  }

  announce('initializing', 'Initializing optional graph projection.')

  try {
    const rect = container.getBoundingClientRect()
    const pixelRatio = getCappedPixelRatio(
      rect.width,
      rect.height,
      window.devicePixelRatio,
    )

    const config: CosmosConfig = {
      spaceSize: 4096,
      backgroundColor: '#071317',
      enableSimulation: false,
      enableSimulationDuringZoom: false,
      enableDrag: false,
      randomSeed: 'into-spatial-foundation-v3.1',
      rescalePositions: false,
      pixelRatio,
      transitionDuration: reducedMotion ? 0 : 350,
      fitViewDuration: reducedMotion ? 0 : 350,
      fitViewOnInit: true,
      fitViewDelay: 100,
      fitViewPadding: 0.12,
      pointDefaultSize: 5,
      pointGreyoutOpacity: 0.08,
      pointOcclusionCulling: true,
      scalePointsOnZoom: false,
      renderHoveredPointRing: true,
      hoveredPointRingColor: '#f7fbfc',
      focusedPointRingColor: '#f7fbfc',
      outlinedPointRingColor: '#9de9f2',
      linkDefaultColor: '#526a73',
      linkDefaultWidth: 0.7,
      linkGreyoutOpacity: 0.035,
      linkDashLength: 8,
      linkDashGap: 5,
      curvedLinks: false,
      linkBlending: true,
      scaleLinksOnZoom: false,
      attribution:
        'Graph projection by <a href="https://github.com/cosmosgl/graph" target="_blank" rel="noreferrer">Cosmos GL</a>',
      onPointClick: (index: number) => {
        onSelectNode(projection.nodeIds[index])
      },
      onBackgroundClick: () => {
        onSelectNode(undefined)
      },
      onSimulationStart: () => {
        announce('running', 'Graph layout is settling.')
      },
      onSimulationEnd: () => {
        graph?.pause()
        announce('settled', 'Graph projection settled; optional rendering is idle.')
      },
      onSimulationPause: () => {
        announce('settled', 'Graph projection paused; optional rendering is idle.')
      },
      onZoomStart: () => {
        announce('running', 'Graph view is changing.')
      },
      onZoomEnd: () => {
        announce('settled', 'Graph projection ready; on-demand rendering is idle.')
      },
    }

    graph = new GraphConstructor(container, config)
    await graph.ready

    if (destroyed) {
      graph.destroy()
      throw new Error('Graph projection was closed during initialization.')
    }

    graph.setPointPositions(projection.pointPositions)
    graph.setPointColors(projection.pointColors)
    graph.setPointSizes(projection.pointSizes)
    graph.setPointShapes(projection.pointShapes)
    graph.setLinks(projection.links)
    graph.setLinkColors(projection.linkColors)
    graph.setLinkStyles(projection.linkStyles)
    graph.render(0, 0)
    graph.pause()
    announce(
      'settled',
      reducedMotion
        ? 'Static graph projection ready; reduced motion is active.'
        : 'Graph projection ready; on-demand rendering is idle.',
    )
  } catch (error) {
    graph?.destroy()
    container.replaceChildren()
    const detail = error instanceof Error ? error.message : String(error)
    announce(
      'unavailable',
      `Graph projection unavailable. The semantic explorer is unchanged. ${detail}`,
    )
    throw error
  }

  const selectNode = (nodeId: string | undefined): void => {
    if (destroyed || !graph) return
    if (!nodeId) {
      graph.setConfigPartial({
        focusedPointIndex: undefined,
        highlightedPointIndices: undefined,
        highlightedLinkIndices: undefined,
        outlinedPointIndices: undefined,
      })
      return
    }

    const pointIndex = projection.indexByNodeId.get(nodeId)
    if (pointIndex === undefined) return
    const highlightedPointIndices = [
      pointIndex,
      ...projection.neighboringPointIndices[pointIndex]!,
    ]

    graph.setConfigPartial({
      focusedPointIndex: pointIndex,
      highlightedPointIndices,
      highlightedLinkIndices:
        projection.connectedLinkIndices[pointIndex] ?? [],
      outlinedPointIndices: undefined,
    })
    if (!hasInitialSelection) {
      hasInitialSelection = true
      return
    }
    graph.zoomToPointByIndex(
      pointIndex,
      reducedMotion ? 0 : 350,
      2.2,
      true,
      false,
    )
  }

  return {
    selectNode,
    fit(): void {
      if (destroyed || !graph) return
      graph.fitView(reducedMotion ? 0 : 350, 0.12, false)
    },
    setReducedMotion(nextReducedMotion: boolean): void {
      if (destroyed || !graph || reducedMotion === nextReducedMotion) return
      reducedMotion = nextReducedMotion
      graph.setConfigPartial({
        transitionDuration: reducedMotion ? 0 : 350,
        fitViewDuration: reducedMotion ? 0 : 350,
      })
      graph.pause()
      announce(
        'settled',
        reducedMotion
          ? 'Graph projection paused; reduced motion is active.'
          : 'Graph projection ready; on-demand rendering is idle.',
      )
    },
    destroy(): void {
      if (destroyed) return
      destroyed = true
      graph?.destroy()
      graph = undefined
      container.replaceChildren()
      onStatus('closed', 'Graph projection closed; semantic state preserved.')
    },
  }
}
