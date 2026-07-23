import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import graphJson from '../../../knowledge/spatial-knowledge-graph.json'
import indexJson from '../../../knowledge/spatial-retrieval-index.json'
import { createExplorerApp, type ExplorerApp } from '../src/app'
import type {
  GraphRenderer,
  KnowledgeGraph,
  RendererLoader,
  RetrievalIndex,
} from '../src/types'

const graph = graphJson as KnowledgeGraph
const index = indexJson as RetrievalIndex

class MotionQuery extends EventTarget implements MediaQueryList {
  matches = false
  media = '(prefers-reduced-motion: reduce)'
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null =
    null

  addListener(): void {}
  removeListener(): void {}
  dispatch(value: boolean): void {
    this.matches = value
    this.dispatchEvent(new Event('change'))
  }
}

const flush = (): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, 0))

describe('semantic explorer', () => {
  let root: HTMLDivElement
  let app: ExplorerApp | undefined

  beforeEach(() => {
    root = document.createElement('div')
    document.body.replaceChildren(root)
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    app?.destroy()
    app = undefined
  })

  it('supports indexed search and complete typed relationships without canvas', () => {
    const loadRenderer = vi.fn<RendererLoader>()
    app = createExplorerApp(root, {
      graph,
      index,
      loadRenderer,
      motionQuery: new MotionQuery(),
    })

    expect(root.querySelector('canvas')).toBeNull()
    expect(root.querySelector('[data-node-count]')?.textContent).toBe('551')
    expect(root.querySelector('[data-edge-count]')?.textContent).toBe('1,607')
    expect(
      root.querySelector<HTMLElement>('.node-id-large')?.textContent,
    ).toBe('P58')
    expect(root.querySelectorAll('.relationship-card')).toHaveLength(19)
    expect(root.textContent).toContain('defines')
    expect(loadRenderer).not.toHaveBeenCalled()

    const sourceSectionResult = root.querySelector<HTMLButtonElement>(
      '[data-node-id="SECTION:P58"]',
    )!
    sourceSectionResult.click()
    expect(
      root.querySelector<HTMLElement>('.node-id-large')?.textContent,
    ).toBe('SECTION:P58')
    expect(window.location.hash).toBe('#node=SECTION%3AP58')
  })

  it('opens the optional renderer only on intent and preserves state on close', async () => {
    const destroy = vi.fn()
    const selectNode = vi.fn()
    const renderer: GraphRenderer = {
      destroy,
      selectNode,
      fit: vi.fn(),
      setReducedMotion: vi.fn(),
    }
    const loadRenderer: RendererLoader = vi.fn(async ({ container, onStatus }) => {
      container.append(document.createElement('canvas'))
      onStatus('settled', 'Test graph is idle.')
      return renderer
    })
    app = createExplorerApp(root, {
      graph,
      index,
      loadRenderer,
      motionQuery: new MotionQuery(),
    })

    const toggle = root.querySelector<HTMLButtonElement>(
      '[data-toggle-graph]',
    )!
    expect(loadRenderer).not.toHaveBeenCalled()
    toggle.click()
    await flush()

    expect(loadRenderer).toHaveBeenCalledOnce()
    expect(root.querySelector('canvas')).not.toBeNull()
    expect(toggle.textContent).toBe('Close graph')
    expect(selectNode).toHaveBeenCalledWith('P58')

    toggle.click()
    expect(destroy).toHaveBeenCalledOnce()
    expect(root.querySelector('canvas')).toBeNull()
    expect(toggle.textContent).toBe('Open graph')
    expect(document.activeElement).toBe(toggle)
    expect(
      root.querySelector<HTMLElement>('.node-id-large')?.textContent,
    ).toBe('P58')
  })

  it('keeps the semantic workflow intact when WebGL initialization fails', async () => {
    const loadRenderer: RendererLoader = vi.fn(async ({ onStatus }) => {
      onStatus(
        'unavailable',
        'Graph projection unavailable. The semantic explorer is unchanged.',
      )
      throw new Error('WebGL unavailable')
    })
    app = createExplorerApp(root, {
      graph,
      index,
      loadRenderer,
      motionQuery: new MotionQuery(),
    })

    root
      .querySelector<HTMLButtonElement>('[data-toggle-graph]')!
      .click()
    await flush()

    expect(root.querySelector('canvas')).toBeNull()
    expect(root.querySelector('[data-renderer-status]')?.textContent).toContain(
      'semantic explorer is unchanged',
    )
    expect(root.querySelectorAll('.relationship-card')).toHaveLength(19)
    expect(
      root.querySelector<HTMLButtonElement>('[data-toggle-graph]')?.textContent,
    ).toBe('Retry graph')
  })

  it('propagates a changed reduced-motion preference to an open renderer', async () => {
    const motionQuery = new MotionQuery()
    const setReducedMotion = vi.fn()
    const loadRenderer: RendererLoader = vi.fn(async () => ({
      destroy: vi.fn(),
      selectNode: vi.fn(),
      fit: vi.fn(),
      setReducedMotion,
    }))
    app = createExplorerApp(root, {
      graph,
      index,
      loadRenderer,
      motionQuery,
    })

    root
      .querySelector<HTMLButtonElement>('[data-toggle-graph]')!
      .click()
    await flush()
    motionQuery.dispatch(true)

    expect(setReducedMotion).toHaveBeenCalledWith(true)
  })
})
