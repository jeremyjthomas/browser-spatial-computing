import { Graph } from '@cosmos.gl/graph'

import {
  createGraphRendererWithConstructor,
  type CosmosGraphConstructor,
} from './renderer-adapter'
import type { CreateRendererOptions, GraphRenderer } from './types'

export function createGraphRenderer(
  options: CreateRendererOptions,
): Promise<GraphRenderer> {
  return createGraphRendererWithConstructor(
    Graph as unknown as CosmosGraphConstructor,
    options,
  )
}
