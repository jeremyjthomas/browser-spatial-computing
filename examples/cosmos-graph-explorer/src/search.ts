import type {
  KnowledgeGraph,
  Neighborhood,
  RelationshipRecord,
  RetrievalIndex,
  SearchResult,
} from './types'

const TOKEN_PATTERN = /[a-z0-9][a-z0-9_+.-]*/g
const TOKEN_SEPARATOR = /[._+-]+/
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'with',
])

export function tokenize(value: string): string[] {
  const matches = value.toLowerCase().match(TOKEN_PATTERN) ?? []
  const tokens: string[] = []

  for (const token of matches) {
    for (const candidate of [token, ...token.split(TOKEN_SEPARATOR)]) {
      if (candidate && !STOP_WORDS.has(candidate)) {
        tokens.push(candidate)
      }
    }
  }

  return tokens
}

export function searchNodes(
  graph: KnowledgeGraph,
  index: RetrievalIndex,
  query: string,
  options: { nodeType?: string; limit?: number } = {},
): SearchResult[] {
  const normalized = query.trim().toLowerCase()
  const scores = new Map<string, number>()
  const addScore = (nodeId: string, score: number): void => {
    scores.set(nodeId, (scores.get(nodeId) ?? 0) + score)
  }

  const exactOffset = index.exact_id[normalized]
  if (exactOffset !== undefined) {
    const exactNode = graph.nodes[exactOffset]
    if (exactNode) addScore(exactNode.id, 1000)
  }

  for (const token of tokenize(normalized)) {
    for (const nodeId of index.terms[token] ?? []) {
      addScore(nodeId, 25)
    }
  }

  for (const node of graph.nodes) {
    if (normalized && node.label.toLowerCase().includes(normalized)) {
      addScore(node.id, 80)
    }
    if (normalized && node.id.toLowerCase().startsWith(normalized)) {
      addScore(node.id, 60)
    }
  }

  const allowed = options.nodeType
    ? new Set(index.types[options.nodeType] ?? [])
    : undefined
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))

  return [...scores.entries()]
    .filter(([nodeId]) => !allowed || allowed.has(nodeId))
    .sort(([leftId, leftScore], [rightId, rightScore]) => {
      if (leftScore !== rightScore) return rightScore - leftScore
      return leftId < rightId ? -1 : leftId > rightId ? 1 : 0
    })
    .slice(0, options.limit ?? 20)
    .flatMap(([nodeId, score]) => {
      const node = nodesById.get(nodeId)
      return node ? [{ score, node }] : []
    })
}

export function getNeighborhood(
  graph: KnowledgeGraph,
  index: RetrievalIndex,
  nodeId: string,
): Neighborhood {
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const root = nodesById.get(nodeId)
  if (!root) throw new Error(`Unknown node ID: ${nodeId}`)

  const relationships: RelationshipRecord[] = []
  const edgeOffsets = new Set<number>()

  for (const offset of index.outgoing[nodeId] ?? []) {
    const edge = graph.edges[offset]
    const peer = edge && nodesById.get(edge.target)
    if (edge && peer) {
      edgeOffsets.add(offset)
      relationships.push({ edge, direction: 'outgoing', peer })
    }
  }

  for (const offset of index.incoming[nodeId] ?? []) {
    const edge = graph.edges[offset]
    const peer = edge && nodesById.get(edge.source)
    if (edge && peer) {
      edgeOffsets.add(offset)
      relationships.push({ edge, direction: 'incoming', peer })
    }
  }

  relationships.sort((left, right) => {
    const leftKey = `${left.direction}:${left.edge.predicate}:${left.peer.id}`
    const rightKey = `${right.direction}:${right.edge.predicate}:${right.peer.id}`
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0
  })

  const nodes = new Map<string, KnowledgeGraph['nodes'][number]>([
    [root.id, root],
  ])
  for (const relationship of relationships) {
    nodes.set(relationship.peer.id, relationship.peer)
  }

  return {
    root,
    nodes: [...nodes.values()].sort((left, right) =>
      left.id < right.id ? -1 : left.id > right.id ? 1 : 0,
    ),
    edges: [...edgeOffsets]
      .sort((left, right) => left - right)
      .flatMap((offset) => graph.edges[offset] ?? []),
    relationships,
  }
}
