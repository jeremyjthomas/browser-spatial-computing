import { describe, expect, it } from 'vitest'

import graphJson from '../../../knowledge/spatial-knowledge-graph.json'
import indexJson from '../../../knowledge/spatial-retrieval-index.json'
import { getNeighborhood, searchNodes, tokenize } from '../src/search'
import type { KnowledgeGraph, RetrievalIndex } from '../src/types'

const graph = graphJson as KnowledgeGraph
const index = indexJson as RetrievalIndex

describe('retrieval-index parity', () => {
  it('tokenizes compound terms with the Python graph contract', () => {
    expect(tokenize('CSS-3D and active_frame.capacity')).toEqual([
      'css-3d',
      'css',
      '3d',
      'active_frame.capacity',
      'active',
      'frame',
      'capacity',
    ])
  })

  it('ranks exact IDs and concepts deterministically', () => {
    expect(searchNodes(graph, index, 'P58', { limit: 1 })[0]?.node.id).toBe(
      'P58',
    )
    expect(
      searchNodes(graph, index, 'active frame capacity', { limit: 10 }).map(
        ({ score, node }) => [score, node.id],
      ),
    ).toEqual([
      [150, 'CONTROL:active_frame_capacity'],
      [150, 'RUNTIME-009'],
      [100, 'AT-PERFORMANCE-02'],
      [100, 'AT-PERFORMANCE-05'],
      [100, 'AT-PERFORMANCE-07'],
      [100, 'CATEGORY:frame_capacity'],
      [100, 'P59'],
      [100, 'RUNTIME-011'],
      [100, 'RUNTIME-012'],
      [100, 'RUNTIME-013'],
    ])
  })

  it('applies type filters after the same score calculation', () => {
    expect(
      searchNodes(graph, index, 'runtime', {
        nodeType: 'normative_rule',
        limit: 10,
      }).map(({ score, node }) => [score, node.id]),
    ).toEqual([
      [190, 'RUNTIME-001'],
      [130, 'AI-001'],
      [110, 'RUNTIME-002'],
      [110, 'RUNTIME-003'],
      [110, 'RUNTIME-004'],
      [110, 'RUNTIME-005'],
      [110, 'RUNTIME-006'],
      [110, 'RUNTIME-007'],
      [110, 'RUNTIME-008'],
      [110, 'RUNTIME-009'],
    ])
    expect(searchNodes(graph, index, '')).toEqual([])
  })

  it('returns every incoming and outgoing relationship in a one-hop record', () => {
    const neighborhood = getNeighborhood(graph, index, 'P58')
    expect(neighborhood.root.id).toBe('P58')
    expect(neighborhood.nodes).toHaveLength(20)
    expect(neighborhood.edges).toHaveLength(19)
    expect(neighborhood.relationships).toHaveLength(19)
    expect(
      neighborhood.relationships.every(
        ({ edge, direction, peer }) =>
          (direction === 'outgoing' &&
            edge.source === 'P58' &&
            edge.target === peer.id) ||
          (direction === 'incoming' &&
            edge.target === 'P58' &&
            edge.source === peer.id),
      ),
    ).toBe(true)
  })
})
