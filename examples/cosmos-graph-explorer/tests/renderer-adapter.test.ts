import { beforeEach, describe, expect, it, vi } from 'vitest'

import graphJson from '../../../knowledge/spatial-knowledge-graph.json'
import { buildGraphProjection } from '../src/projection'
import {
  createGraphRendererWithConstructor,
  getCappedPixelRatio,
  type CosmosGraphLike,
} from '../src/renderer-adapter'
import type {
  CreateRendererOptions,
  KnowledgeGraph,
  RendererStatus,
} from '../src/types'

class FakeGraph implements CosmosGraphLike {
  static instances: FakeGraph[] = []

  readonly ready = Promise.resolve()
  readonly config: Record<string, unknown>
  readonly canvas = document.createElement('canvas')
  readonly pointPositions: Float32Array[] = []
  readonly pointColors: Float32Array[] = []
  readonly pointSizes: Float32Array[] = []
  readonly pointShapes: Float32Array[] = []
  readonly links: Float32Array[] = []
  readonly linkColors: Float32Array[] = []
  readonly linkStyles: Float32Array[] = []
  readonly partialConfigs: Record<string, unknown>[] = []
  readonly renders: Array<[number | undefined, number | undefined]> = []
  readonly zooms: Array<[number, number | undefined]> = []
  readonly fits: Array<[number | undefined, number | undefined]> = []
  pauseCount = 0
  destroyCount = 0

  constructor(container: HTMLDivElement, config: Record<string, unknown>) {
    this.config = config
    container.append(this.canvas)
    FakeGraph.instances.push(this)
  }

  setPointPositions(values: Float32Array): void {
    this.pointPositions.push(values)
  }
  setPointColors(values: Float32Array): void {
    this.pointColors.push(values)
  }
  setPointSizes(values: Float32Array): void {
    this.pointSizes.push(values)
  }
  setPointShapes(values: Float32Array): void {
    this.pointShapes.push(values)
  }
  setLinks(values: Float32Array): void {
    this.links.push(values)
  }
  setLinkColors(values: Float32Array): void {
    this.linkColors.push(values)
  }
  setLinkStyles(values: Float32Array): void {
    this.linkStyles.push(values)
  }
  setConfigPartial(config: Record<string, unknown>): void {
    this.partialConfigs.push(config)
  }
  render(
    simulationAlpha?: number,
    transitionDuration?: number,
  ): void {
    this.renders.push([simulationAlpha, transitionDuration])
  }
  zoomToPointByIndex(index: number, duration?: number): void {
    this.zooms.push([index, duration])
  }
  fitView(duration?: number, padding?: number): void {
    this.fits.push([duration, padding])
  }
  pause(): void {
    this.pauseCount += 1
  }
  destroy(): void {
    this.destroyCount += 1
  }
}

class FailingGraph extends FakeGraph {
  override readonly ready = Promise.reject(
    new Error('WebGL2 is intentionally unavailable.'),
  )
}

const projection = buildGraphProjection(graphJson as KnowledgeGraph)

function makeOptions(
  container: HTMLDivElement,
  statuses: Array<[RendererStatus, string]>,
  onSelectNode = vi.fn(),
): CreateRendererOptions {
  return {
    container,
    projection,
    reducedMotion: false,
    onSelectNode,
    onStatus: (status, message) => statuses.push([status, message]),
  }
}

describe('Cosmos renderer lifecycle', () => {
  beforeEach(() => {
    FakeGraph.instances = []
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    })
  })

  it('caps drawing-buffer cost independently of device pixel ratio', () => {
    expect(getCappedPixelRatio(1920, 1080, 3)).toBeLessThan(1)
    expect(getCappedPixelRatio(800, 600, 3)).toBe(1.5)
  })

  it('loads typed arrays, synchronizes selection, settles, and disposes', async () => {
    const container = document.createElement('div')
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 1200,
      bottom: 700,
      width: 1200,
      height: 700,
      toJSON: () => ({}),
    })
    const statuses: Array<[RendererStatus, string]> = []
    const onSelectNode = vi.fn()
    const renderer = await createGraphRendererWithConstructor(
      FakeGraph,
      makeOptions(container, statuses, onSelectNode),
    )
    const fake = FakeGraph.instances[0]!

    expect(fake.pointPositions[0]).toBe(projection.pointPositions)
    expect(fake.links[0]).toBe(projection.links)
    expect(fake.pointShapes[0]).toBe(projection.pointShapes)
    expect(fake.linkStyles[0]).toBe(projection.linkStyles)
    expect(fake.renders).toEqual([[0, 0]])
    expect(fake.config.enableSimulation).toBe(false)
    expect(fake.pauseCount).toBe(1)
    expect(fake.config.pixelRatio).toBeLessThanOrEqual(1.5)

    renderer.selectNode('P58')
    const p58Index = projection.indexByNodeId.get('P58')!
    expect(fake.partialConfigs.at(-1)).toMatchObject({
      focusedPointIndex: p58Index,
      highlightedLinkIndices: projection.connectedLinkIndices[p58Index],
    })
    expect(fake.config.fitViewDelay).toBe(100)
    expect(fake.fits).toHaveLength(0)
    expect(fake.zooms).toHaveLength(0)

    renderer.selectNode('RUNTIME-009')
    const runtimeIndex = projection.indexByNodeId.get('RUNTIME-009')!
    expect(fake.zooms.at(-1)).toEqual([runtimeIndex, 350])

    const pointClick = fake.config.onPointClick as (index: number) => void
    pointClick(p58Index)
    expect(onSelectNode).toHaveBeenCalledWith('P58')

    const zoomStart = fake.config.onZoomStart as () => void
    const zoomEnd = fake.config.onZoomEnd as () => void
    zoomStart()
    expect(statuses.at(-1)?.[0]).toBe('running')
    zoomEnd()
    expect(statuses.at(-1)?.[0]).toBe('settled')

    const simulationEnd = fake.config.onSimulationEnd as () => void
    simulationEnd()
    expect(fake.pauseCount).toBe(2)
    expect(statuses.at(-1)?.[0]).toBe('settled')

    renderer.setReducedMotion(true)
    expect(fake.partialConfigs.at(-1)).toMatchObject({
      transitionDuration: 0,
    })
    expect(fake.pauseCount).toBe(3)

    renderer.destroy()
    renderer.destroy()
    expect(fake.destroyCount).toBe(1)
    expect(container.childElementCount).toBe(0)
    expect(statuses.at(-1)?.[0]).toBe('closed')
  })

  it('removes a partial canvas and preserves a recoverable failure status', async () => {
    const container = document.createElement('div')
    const statuses: Array<[RendererStatus, string]> = []

    await expect(
      createGraphRendererWithConstructor(
        FailingGraph,
        makeOptions(container, statuses),
      ),
    ).rejects.toThrow('intentionally unavailable')

    expect(FakeGraph.instances[0]?.destroyCount).toBe(1)
    expect(container.childElementCount).toBe(0)
    expect(statuses.at(-1)).toEqual([
      'unavailable',
      expect.stringContaining('semantic explorer is unchanged'),
    ])
  })
})
