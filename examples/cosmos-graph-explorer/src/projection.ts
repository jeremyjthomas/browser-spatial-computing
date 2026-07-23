import type {
  GraphProjection,
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
} from './types'

const SPACE_SIZE = 4096
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

const TYPE_GROUPS: Record<string, number> = {
  artifact: 0,
  foundation_layer: 0,
  principle: 0,
  source_section: 0,
  normative_rule: 1,
  rule_category: 1,
  acceptance_test: 1,
  conformance_class: 1,
  domain_entity: 2,
  ownership_plane: 2,
  performance_control: 3,
  performance_preset: 3,
  build_checkpoint: 3,
  evaluation_scenario: 4,
  reference: 4,
  tag: 4,
}

const GROUP_COLORS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.22, 0.78, 0.88, 1],
  [0.98, 0.68, 0.25, 1],
  [0.25, 0.83, 0.62, 1],
  [0.7, 0.56, 0.98, 1],
  [0.67, 0.75, 0.84, 1],
]

const GROUP_SHAPES = [0, 3, 1, 2, 5] as const

function groupForNode(node: KnowledgeNode): number {
  return TYPE_GROUPS[node.type] ?? GROUP_COLORS.length - 1
}

function styleForEdge(edge: KnowledgeEdge): number {
  if (
    edge.predicate === 'grounded_in' ||
    edge.predicate === 'explained_by' ||
    edge.predicate === 'specified_by' ||
    edge.predicate === 'supports'
  ) {
    return 1
  }
  if (
    edge.predicate.startsWith('requires_') ||
    edge.predicate === 'validates_category' ||
    edge.predicate === 'categorized_as' ||
    edge.predicate === 'tagged_with'
  ) {
    return 2
  }
  return 0
}

export function buildGraphProjection(graph: KnowledgeGraph): GraphProjection {
  const nodeIds = graph.nodes.map((node) => node.id)
  const indexByNodeId = new Map(nodeIds.map((id, index) => [id, index]))
  const nodesByGroup = new Map<number, number[]>()

  graph.nodes.forEach((node, index) => {
    const group = groupForNode(node)
    const members = nodesByGroup.get(group) ?? []
    members.push(index)
    nodesByGroup.set(group, members)
  })

  const pointPositions = new Float32Array(graph.nodes.length * 2)
  const pointColors = new Float32Array(graph.nodes.length * 4)
  const pointSizes = new Float32Array(graph.nodes.length)
  const pointShapes = new Float32Array(graph.nodes.length)
  const center = SPACE_SIZE / 2
  const clusterRadius = SPACE_SIZE * 0.29

  for (const [group, members] of nodesByGroup) {
    const clusterAngle = (group / GROUP_COLORS.length) * Math.PI * 2 - Math.PI / 2
    const clusterX = center + Math.cos(clusterAngle) * clusterRadius
    const clusterY = center + Math.sin(clusterAngle) * clusterRadius
    const color = GROUP_COLORS[group] ?? GROUP_COLORS.at(-1)!
    const shape = GROUP_SHAPES[group] ?? GROUP_SHAPES.at(-1)!

    members.forEach((nodeIndex, localIndex) => {
      const radius = 24 * Math.sqrt(localIndex)
      const angle = localIndex * GOLDEN_ANGLE
      pointPositions[nodeIndex * 2] = clusterX + Math.cos(angle) * radius
      pointPositions[nodeIndex * 2 + 1] = clusterY + Math.sin(angle) * radius
      pointColors.set(color, nodeIndex * 4)
      pointShapes[nodeIndex] = shape

      const degree =
        graph.edges.reduce(
          (count, edge) =>
            count + (edge.source === nodeIds[nodeIndex] || edge.target === nodeIds[nodeIndex] ? 1 : 0),
          0,
        )
      pointSizes[nodeIndex] = Math.min(14, 4.5 + Math.sqrt(degree) * 0.65)
    })
  }

  const links = new Float32Array(graph.edges.length * 2)
  const linkColors = new Float32Array(graph.edges.length * 4)
  const linkStyles = new Float32Array(graph.edges.length)
  const neighboringSets = Array.from(
    { length: graph.nodes.length },
    () => new Set<number>(),
  )
  const connectedLinkIndices = Array.from(
    { length: graph.nodes.length },
    () => [] as number[],
  )

  graph.edges.forEach((edge, edgeIndex) => {
    const sourceIndex = indexByNodeId.get(edge.source)
    const targetIndex = indexByNodeId.get(edge.target)
    if (sourceIndex === undefined || targetIndex === undefined) {
      throw new Error(
        `Edge ${edge.id} references an unknown endpoint: ${edge.source} -> ${edge.target}`,
      )
    }

    links[edgeIndex * 2] = sourceIndex
    links[edgeIndex * 2 + 1] = targetIndex
    linkColors.set([0.38, 0.52, 0.62, 0.55], edgeIndex * 4)
    linkStyles[edgeIndex] = styleForEdge(edge)
    neighboringSets[sourceIndex]!.add(targetIndex)
    neighboringSets[targetIndex]!.add(sourceIndex)
    connectedLinkIndices[sourceIndex]!.push(edgeIndex)
    connectedLinkIndices[targetIndex]!.push(edgeIndex)
  })

  return {
    nodeIds,
    indexByNodeId,
    pointPositions,
    pointColors,
    pointSizes,
    pointShapes,
    links,
    linkColors,
    linkStyles,
    neighboringPointIndices: neighboringSets.map((neighbors) =>
      [...neighbors].sort((left, right) => left - right),
    ),
    connectedLinkIndices,
  }
}
