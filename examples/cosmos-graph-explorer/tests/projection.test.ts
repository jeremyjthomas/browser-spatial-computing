import { describe, expect, it } from 'vitest'

import graphJson from '../../../knowledge/spatial-knowledge-graph.json'
import { buildGraphProjection } from '../src/projection'
import type { KnowledgeGraph } from '../src/types'

const graph = graphJson as KnowledgeGraph

describe('Cosmos graph projection', () => {
  it('creates stable, bijective ID and typed-array mappings', () => {
    const projection = buildGraphProjection(graph)

    expect(projection.nodeIds).toHaveLength(551)
    expect(projection.indexByNodeId.size).toBe(551)
    expect(projection.pointPositions).toHaveLength(551 * 2)
    expect(projection.pointColors).toHaveLength(551 * 4)
    expect(projection.pointSizes).toHaveLength(551)
    expect(projection.pointShapes).toHaveLength(551)
    expect(projection.links).toHaveLength(1607 * 2)
    expect(projection.linkColors).toHaveLength(1607 * 4)
    expect(projection.linkStyles).toHaveLength(1607)

    projection.nodeIds.forEach((nodeId, index) => {
      expect(projection.indexByNodeId.get(nodeId)).toBe(index)
    })

    for (const endpoint of projection.links) {
      expect(Number.isInteger(endpoint)).toBe(true)
      expect(endpoint).toBeGreaterThanOrEqual(0)
      expect(endpoint).toBeLessThan(551)
    }
  })

  it('is deterministic and uses shape and stroke cues alongside color', () => {
    const first = buildGraphProjection(graph)
    const second = buildGraphProjection(graph)

    expect([...first.pointPositions]).toEqual([...second.pointPositions])
    expect(new Set(first.pointShapes)).toEqual(new Set([0, 1, 2, 3, 5]))
    expect(new Set(first.linkStyles)).toEqual(new Set([0, 1, 2]))
  })

  it('rejects an edge whose stable endpoint cannot be resolved', () => {
    const invalidGraph: KnowledgeGraph = {
      ...graph,
      edges: [
        {
          ...graph.edges[0]!,
          target: 'MISSING:NODE',
        },
      ],
    }

    expect(() => buildGraphProjection(invalidGraph)).toThrow(
      /unknown endpoint/,
    )
  })
})
