import graphUrl from '../../../knowledge/spatial-knowledge-graph.json?url'
import indexUrl from '../../../knowledge/spatial-retrieval-index.json?url'

import { createExplorerApp } from './app'
import './styles.css'
import type {
  KnowledgeGraph,
  RendererLoader,
  RetrievalIndex,
} from './types'

const rootCandidate = document.querySelector<HTMLElement>('#app')
if (!rootCandidate) throw new Error('Explorer root element is missing.')
const root: HTMLElement = rootCandidate

const loadRenderer: RendererLoader = async (options) => {
  const { createGraphRenderer } = await import('./cosmos-renderer')
  return createGraphRenderer(options)
}

async function loadJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${label} failed to load (${response.status}).`)
  }
  return (await response.json()) as T
}

async function start(): Promise<void> {
  root.innerHTML =
    '<p class="boot-status" role="status">Loading committed graph and retrieval index…</p>'

  try {
    const [graph, index] = await Promise.all([
      loadJson<KnowledgeGraph>(graphUrl, 'Knowledge graph'),
      loadJson<RetrievalIndex>(indexUrl, 'Retrieval index'),
    ])
    const app = createExplorerApp(root, { graph, index, loadRenderer })
    window.addEventListener('pagehide', () => app.destroy(), { once: true })
    if (import.meta.hot) {
      import.meta.hot.dispose(() => app.destroy())
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    root.replaceChildren()
    const failure = document.createElement('p')
    failure.className = 'boot-status boot-status-error'
    failure.setAttribute('role', 'alert')
    failure.textContent = `The semantic explorer could not load its generated artifacts. ${detail}`
    root.append(failure)
  }
}

void start()
