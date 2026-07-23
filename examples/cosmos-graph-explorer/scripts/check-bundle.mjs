import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const manifestPath = resolve('dist/.vite/manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const entry = manifest['index.html']

if (!entry?.isEntry) {
  throw new Error('Vite manifest does not contain the explorer entry.')
}

const cosmosModuleKey = Object.keys(manifest).find((key) =>
  key.endsWith('src/cosmos-renderer.ts'),
)
if (!cosmosModuleKey) {
  throw new Error('Cosmos renderer is missing from the production manifest.')
}

if (!entry.dynamicImports?.includes(cosmosModuleKey)) {
  throw new Error(
    'Cosmos renderer is not a dynamic import from the initial explorer entry.',
  )
}

const staticClosure = new Set()
const visitStaticImports = (key) => {
  if (staticClosure.has(key)) return
  staticClosure.add(key)
  for (const importedKey of manifest[key]?.imports ?? []) {
    visitStaticImports(importedKey)
  }
}
visitStaticImports('index.html')

if (staticClosure.has(cosmosModuleKey)) {
  throw new Error('Cosmos renderer leaked into the initial static chunk graph.')
}

const cosmosChunk = manifest[cosmosModuleKey]
const initialBytes = (await stat(resolve('dist', entry.file))).size
const cosmosEntryBytes = (await stat(resolve('dist', cosmosChunk.file))).size

if (initialBytes > 150_000) {
  throw new Error(
    `Initial explorer entry is unexpectedly large: ${initialBytes} bytes.`,
  )
}

const summary = {
  initialEntry: entry.file,
  initialBytes,
  dynamicCosmosEntry: cosmosChunk.file,
  dynamicCosmosEntryBytes: cosmosEntryBytes,
  initialStaticModules: [...staticClosure],
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
