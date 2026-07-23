import { buildGraphProjection } from './projection'
import { getNeighborhood, searchNodes } from './search'
import type {
  GraphRenderer,
  KnowledgeGraph,
  KnowledgeNode,
  RendererLoader,
  RendererStatus,
  RetrievalIndex,
  SearchResult,
} from './types'

type AppDependencies = {
  graph: KnowledgeGraph
  index: RetrievalIndex
  loadRenderer: RendererLoader
  motionQuery?: MediaQueryList
}

export type ExplorerApp = {
  destroy(): void
  selectNode(nodeId: string): void
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function humanize(value: string): string {
  return value.replaceAll('_', ' ')
}

function validateArtifacts(
  graph: KnowledgeGraph,
  index: RetrievalIndex,
): void {
  const nodeCount = graph.nodes.length
  const edgeCount = graph.edges.length
  if (
    graph.metadata.node_count !== nodeCount ||
    graph.metadata.edge_count !== edgeCount ||
    index.node_count !== nodeCount ||
    index.edge_count !== edgeCount ||
    index.graph_version !== graph.version
  ) {
    throw new Error('Knowledge graph and retrieval index are out of sync.')
  }
}

function nodeFromHash(graph: KnowledgeGraph): string | undefined {
  const match = window.location.hash.match(/^#node=(.+)$/)
  if (!match?.[1]) return undefined
  const nodeId = decodeURIComponent(match[1])
  return graph.nodes.some((node) => node.id === nodeId) ? nodeId : undefined
}

function replaceNodeHash(nodeId: string | undefined): void {
  const url = new URL(window.location.href)
  url.hash = nodeId ? `node=${encodeURIComponent(nodeId)}` : ''
  window.history.replaceState(null, '', url)
}

export function createExplorerApp(
  root: HTMLElement,
  dependencies: AppDependencies,
): ExplorerApp {
  const { graph, index, loadRenderer } = dependencies
  validateArtifacts(graph, index)
  const projection = buildGraphProjection(graph)
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const motionQuery =
    dependencies.motionQuery ??
    window.matchMedia('(prefers-reduced-motion: reduce)')

  root.innerHTML = `
    <header class="masthead">
      <div>
        <p class="eyebrow">Foundation 3.1 · reference explorer</p>
        <h1>Spatial knowledge graph</h1>
        <p class="intro">Search the generated retrieval index, inspect typed relationships, and open an optional Cosmos GL projection without changing repository truth.</p>
      </div>
      <dl class="graph-facts" aria-label="Knowledge graph facts">
        <div><dt>Nodes</dt><dd data-node-count></dd></div>
        <div><dt>Edges</dt><dd data-edge-count></dd></div>
        <div><dt>Foundation</dt><dd data-foundation-version></dd></div>
      </dl>
    </header>
    <main>
      <section class="query-bar" aria-labelledby="query-heading">
        <div class="query-copy">
          <p class="eyebrow" id="query-heading">Retrieval projection</p>
          <p>Exact IDs and concept terms use the committed index.</p>
        </div>
        <label class="field search-field">
          <span>Search concepts or IDs</span>
          <input type="search" value="performance console" autocomplete="off" spellcheck="false" data-search />
        </label>
        <label class="field type-field">
          <span>Node type</span>
          <select data-type-filter></select>
        </label>
        <button class="secondary-action" type="button" data-clear>Clear</button>
      </section>

      <div class="explorer-grid">
        <aside class="results-panel" aria-labelledby="results-heading">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Ranked matches</p>
              <h2 id="results-heading">Search results</h2>
            </div>
            <output data-result-count aria-live="polite"></output>
          </div>
          <div class="result-list" data-results></div>
        </aside>

        <section class="graph-panel" aria-labelledby="graph-heading">
          <div class="panel-heading graph-heading">
            <div>
              <p class="eyebrow">Optional graphics projection</p>
              <h2 id="graph-heading">Relationship field</h2>
            </div>
            <div class="graph-actions">
              <button class="secondary-action" type="button" data-fit disabled>Fit all</button>
              <button class="primary-action" type="button" data-toggle-graph>Open graph</button>
            </div>
          </div>
          <div class="renderer-status" data-renderer-status role="status" aria-live="polite">
            Graph projection closed; the semantic explorer is ready.
          </div>
          <div class="graph-stage-shell">
            <div class="graph-placeholder" data-graph-placeholder>
              <span class="projection-mark" aria-hidden="true"></span>
              <p>Open the graph when spatial overview helps. Search, node detail, and every typed relationship remain available without it.</p>
            </div>
            <div class="graph-stage" data-graph-stage aria-hidden="true"></div>
          </div>
          <div class="visual-legend" aria-label="Visual graph legend">
            <span><i class="legend-shape legend-source"></i>Source</span>
            <span><i class="legend-shape legend-rule"></i>Rule or test</span>
            <span><i class="legend-shape legend-model"></i>Model</span>
            <span><i class="legend-shape legend-runtime"></i>Runtime</span>
            <span><i class="legend-line legend-evidence"></i>Evidence</span>
            <span><i class="legend-line legend-requirement"></i>Requirement</span>
          </div>
        </section>

        <aside class="detail-panel" id="selected-node" aria-labelledby="detail-heading" tabindex="-1">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Semantic projection</p>
              <h2 id="detail-heading">Selected node</h2>
            </div>
          </div>
          <div data-detail></div>
        </aside>
      </div>
    </main>
    <footer>
      <p>Canvas coordinates are personal projection state. The AI foundation remains canonical; graph and index files remain generated retrieval artifacts.</p>
    </footer>
  `

  const nodeCount = root.querySelector<HTMLElement>('[data-node-count]')!
  const edgeCount = root.querySelector<HTMLElement>('[data-edge-count]')!
  const foundationVersion = root.querySelector<HTMLElement>(
    '[data-foundation-version]',
  )!
  const searchInput =
    root.querySelector<HTMLInputElement>('[data-search]')!
  const typeFilter = root.querySelector<HTMLSelectElement>(
    '[data-type-filter]',
  )!
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]')!
  const resultsContainer =
    root.querySelector<HTMLElement>('[data-results]')!
  const resultCount =
    root.querySelector<HTMLOutputElement>('[data-result-count]')!
  const detailContainer = root.querySelector<HTMLElement>('[data-detail]')!
  const graphStage =
    root.querySelector<HTMLDivElement>('[data-graph-stage]')!
  const graphPlaceholder = root.querySelector<HTMLElement>(
    '[data-graph-placeholder]',
  )!
  const rendererStatus = root.querySelector<HTMLElement>(
    '[data-renderer-status]',
  )!
  const toggleGraphButton = root.querySelector<HTMLButtonElement>(
    '[data-toggle-graph]',
  )!
  const fitButton = root.querySelector<HTMLButtonElement>('[data-fit]')!

  nodeCount.textContent = graph.nodes.length.toLocaleString()
  edgeCount.textContent = graph.edges.length.toLocaleString()
  foundationVersion.textContent = graph.metadata.foundation_version

  const allOption = createElement('option', undefined, 'All types')
  allOption.value = ''
  typeFilter.append(allOption)
  for (const type of Object.keys(index.types).sort()) {
    const option = createElement(
      'option',
      undefined,
      `${humanize(type)} (${index.types[type]!.length})`,
    )
    option.value = type
    typeFilter.append(option)
  }

  let selectedNodeId: string | undefined =
    nodeFromHash(graph) ?? (nodesById.has('P58') ? 'P58' : graph.nodes[0]?.id)
  let currentResults: SearchResult[] = []
  let renderer: GraphRenderer | undefined
  let openingRenderer = false
  let destroyed = false

  const updateRendererStatus = (
    status: RendererStatus,
    message: string,
  ): void => {
    rendererStatus.dataset.status = status
    rendererStatus.textContent = message
  }

  const renderResults = (): void => {
    currentResults = searchNodes(graph, index, searchInput.value, {
      nodeType: typeFilter.value || undefined,
      limit: 20,
    })
    resultsContainer.replaceChildren()
    resultCount.textContent = `${currentResults.length} result${currentResults.length === 1 ? '' : 's'}`

    if (currentResults.length === 0) {
      const empty = createElement(
        'p',
        'empty-state',
        searchInput.value.trim()
          ? 'No indexed nodes match this query and type.'
          : 'Enter a concept or stable node ID to search.',
      )
      resultsContainer.append(empty)
      return
    }

    for (const result of currentResults) {
      const button = createElement('button', 'result-card')
      button.type = 'button'
      button.dataset.nodeId = result.node.id
      if (result.node.id === selectedNodeId) {
        button.classList.add('is-selected')
        button.setAttribute('aria-current', 'true')
      }

      const topLine = createElement('span', 'result-topline')
      topLine.append(
        createElement('code', 'node-id', result.node.id),
        createElement('span', 'score', `${result.score} pts`),
      )
      button.append(
        topLine,
        createElement('span', 'result-label', result.node.label),
        createElement('span', 'result-type', humanize(result.node.type)),
      )
      button.addEventListener('click', () => selectNode(result.node.id, true))
      resultsContainer.append(button)
    }
  }

  const createReferenceList = (
    title: string,
    values: string[],
  ): HTMLElement => {
    const section = createElement('section', 'metadata-section')
    section.append(createElement('h3', undefined, title))
    if (values.length === 0) {
      section.append(createElement('p', 'metadata-empty', 'None recorded.'))
      return section
    }
    const list = createElement('ul', 'token-list')
    for (const value of values) {
      const item = createElement('li')
      const relatedNode = nodesById.get(value)
      if (relatedNode) {
        const button = createElement('button', 'token-button', value)
        button.type = 'button'
        button.title = `Select ${relatedNode.label}`
        button.addEventListener('click', () => selectNode(value, true))
        item.append(button)
      } else {
        item.append(createElement('code', 'token', value))
      }
      list.append(item)
    }
    section.append(list)
    return section
  }

  const renderRelationshipGroup = (
    title: string,
    relationships: ReturnType<typeof getNeighborhood>['relationships'],
  ): HTMLElement => {
    const section = createElement('section', 'relationship-section')
    section.append(
      createElement(
        'h3',
        undefined,
        `${title} (${relationships.length})`,
      ),
    )
    if (relationships.length === 0) {
      section.append(
        createElement('p', 'metadata-empty', 'No relationships in this direction.'),
      )
      return section
    }

    const list = createElement('ul', 'relationship-list')
    for (const relationship of relationships) {
      const item = createElement('li')
      const button = createElement('button', 'relationship-card')
      button.type = 'button'
      const directionLabel =
        relationship.direction === 'outgoing' ? 'Outgoing to' : 'Incoming from'
      button.setAttribute(
        'aria-label',
        `${directionLabel} ${relationship.peer.id}: ${humanize(relationship.edge.predicate)}`,
      )
      const relation = createElement('span', 'relationship-predicate')
      relation.append(
        createElement(
          'span',
          'direction-cue',
          relationship.direction === 'outgoing' ? '→' : '←',
        ),
        createElement(
          'code',
          undefined,
          humanize(relationship.edge.predicate),
        ),
      )
      button.append(
        relation,
        createElement(
          'span',
          'relationship-label',
          relationship.peer.label,
        ),
        createElement('code', 'node-id', relationship.peer.id),
      )
      button.addEventListener('click', () =>
        selectNode(relationship.peer.id, true),
      )
      item.append(button)
      list.append(item)
    }
    section.append(list)
    return section
  }

  const renderDetail = (): void => {
    detailContainer.replaceChildren()
    if (!selectedNodeId) {
      detailContainer.append(
        createElement(
          'p',
          'empty-state',
          'Select a search result or graph point to inspect its semantic record.',
        ),
      )
      return
    }

    const neighborhood = getNeighborhood(graph, index, selectedNodeId)
    const node = neighborhood.root
    const header = createElement('div', 'node-heading')
    header.append(
      createElement('code', 'node-id node-id-large', node.id),
      createElement('span', 'node-type', humanize(node.type)),
      createElement('h3', 'node-title', node.label),
    )
    detailContainer.append(header)
    if (node.summary) {
      detailContainer.append(createElement('p', 'node-summary', node.summary))
    }

    const relationshipSummary = createElement('p', 'relationship-summary')
    relationshipSummary.textContent = `${neighborhood.relationships.length} typed relationship${neighborhood.relationships.length === 1 ? '' : 's'} in the one-hop neighborhood.`
    detailContainer.append(
      relationshipSummary,
      createReferenceList('Source references', node.source_refs),
      createReferenceList('Tags', node.tags),
      renderRelationshipGroup(
        'Outgoing',
        neighborhood.relationships.filter(
          (relationship) => relationship.direction === 'outgoing',
        ),
      ),
      renderRelationshipGroup(
        'Incoming',
        neighborhood.relationships.filter(
          (relationship) => relationship.direction === 'incoming',
        ),
      ),
    )
  }

  function selectNode(nodeId: string | undefined, updateHash: boolean): void {
    if (nodeId && !nodesById.has(nodeId)) return
    selectedNodeId = nodeId
    if (updateHash) replaceNodeHash(nodeId)
    renderResults()
    renderDetail()
    renderer?.selectNode(nodeId)
  }

  const closeGraph = (): void => {
    renderer?.destroy()
    renderer = undefined
    openingRenderer = false
    graphStage.replaceChildren()
    graphPlaceholder.hidden = false
    graphStage.classList.remove('is-open')
    toggleGraphButton.textContent = 'Open graph'
    toggleGraphButton.setAttribute('aria-expanded', 'false')
    fitButton.disabled = true
  }

  const openGraph = async (): Promise<void> => {
    if (renderer || openingRenderer || destroyed) return
    openingRenderer = true
    toggleGraphButton.disabled = true
    graphPlaceholder.hidden = true
    graphStage.classList.add('is-open')
    updateRendererStatus('initializing', 'Loading optional Cosmos GL module.')

    try {
      renderer = await loadRenderer({
        container: graphStage,
        projection,
        reducedMotion: motionQuery.matches,
        onSelectNode: (nodeId) => selectNode(nodeId, true),
        onStatus: updateRendererStatus,
      })
      if (destroyed) {
        renderer.destroy()
        renderer = undefined
        return
      }
      renderer.selectNode(selectedNodeId)
      toggleGraphButton.textContent = 'Close graph'
      toggleGraphButton.setAttribute('aria-expanded', 'true')
      fitButton.disabled = false
    } catch {
      renderer = undefined
      graphPlaceholder.hidden = false
      graphStage.classList.remove('is-open')
      toggleGraphButton.textContent = 'Retry graph'
      toggleGraphButton.setAttribute('aria-expanded', 'false')
      fitButton.disabled = true
    } finally {
      openingRenderer = false
      toggleGraphButton.disabled = false
    }
  }

  const handleToggleGraph = (): void => {
    if (renderer) {
      closeGraph()
      toggleGraphButton.focus()
    } else {
      void openGraph()
    }
  }

  const handleSearch = (): void => renderResults()
  const handleClear = (): void => {
    searchInput.value = ''
    typeFilter.value = ''
    renderResults()
    searchInput.focus()
  }
  const handleMotionChange = (): void => {
    renderer?.setReducedMotion(motionQuery.matches)
  }
  const handleKeydown = (event: KeyboardEvent): void => {
    if (
      event.key === '/' &&
      document.activeElement !== searchInput &&
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLSelectElement)
    ) {
      event.preventDefault()
      searchInput.focus()
    }
  }
  const handleHashChange = (): void => {
    const nodeId = nodeFromHash(graph)
    if (nodeId) selectNode(nodeId, false)
  }

  searchInput.addEventListener('input', handleSearch)
  typeFilter.addEventListener('change', handleSearch)
  clearButton.addEventListener('click', handleClear)
  toggleGraphButton.addEventListener('click', handleToggleGraph)
  fitButton.addEventListener('click', () => renderer?.fit())
  motionQuery.addEventListener('change', handleMotionChange)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('hashchange', handleHashChange)

  toggleGraphButton.setAttribute('aria-expanded', 'false')
  toggleGraphButton.setAttribute('aria-controls', 'cosmos-graph-stage')
  graphStage.id = 'cosmos-graph-stage'
  selectNode(selectedNodeId, false)

  return {
    destroy(): void {
      if (destroyed) return
      destroyed = true
      closeGraph()
      searchInput.removeEventListener('input', handleSearch)
      typeFilter.removeEventListener('change', handleSearch)
      clearButton.removeEventListener('click', handleClear)
      toggleGraphButton.removeEventListener('click', handleToggleGraph)
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('hashchange', handleHashChange)
    },
    selectNode(nodeId: string): void {
      selectNode(nodeId, true)
    },
  }
}
