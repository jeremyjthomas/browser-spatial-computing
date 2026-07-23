export type KnowledgeNode = {
  id: string
  type: string
  label: string
  summary: string
  tags: string[]
  source_refs: string[]
  data?: Record<string, unknown>
}

export type KnowledgeEdge = {
  id: string
  source: string
  predicate: string
  target: string
  weight: number
  source_refs: string[]
}

export type KnowledgeGraph = {
  format: string
  version: string
  metadata: {
    foundation_version: string
    node_count: number
    edge_count: number
    node_types: Record<string, number>
    edge_types: Record<string, number>
  }
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

export type RetrievalIndex = {
  format: string
  version: string
  graph_version: string
  node_count: number
  edge_count: number
  exact_id: Record<string, number>
  terms: Record<string, string[]>
  tags: Record<string, string[]>
  types: Record<string, string[]>
  outgoing: Record<string, number[]>
  incoming: Record<string, number[]>
}

export type SearchResult = {
  score: number
  node: KnowledgeNode
}

export type RelationshipRecord = {
  edge: KnowledgeEdge
  direction: 'incoming' | 'outgoing'
  peer: KnowledgeNode
}

export type Neighborhood = {
  root: KnowledgeNode
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  relationships: RelationshipRecord[]
}

export type GraphProjection = {
  nodeIds: string[]
  indexByNodeId: Map<string, number>
  pointPositions: Float32Array
  pointColors: Float32Array
  pointSizes: Float32Array
  pointShapes: Float32Array
  links: Float32Array
  linkColors: Float32Array
  linkStyles: Float32Array
  neighboringPointIndices: number[][]
  connectedLinkIndices: number[][]
}

export type RendererStatus =
  | 'initializing'
  | 'running'
  | 'settled'
  | 'unavailable'
  | 'closed'

export type GraphRenderer = {
  selectNode(nodeId: string | undefined): void
  fit(): void
  setReducedMotion(reducedMotion: boolean): void
  destroy(): void
}

export type CreateRendererOptions = {
  container: HTMLDivElement
  projection: GraphProjection
  reducedMotion: boolean
  onSelectNode(nodeId: string | undefined): void
  onStatus(status: RendererStatus, message: string): void
}

export type RendererLoader = (
  options: CreateRendererOptions,
) => Promise<GraphRenderer>
