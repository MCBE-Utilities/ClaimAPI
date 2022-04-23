// Type imports
import type { Claim } from '../../types/index.js'
// Imports
import { schema, SchemaTypes } from 'beapi-core'

/**
 * Creates the schema for claims.
 */
const claimSchema = schema<Claim>({
  id: SchemaTypes.String,
  owner: SchemaTypes.String,
  members: SchemaTypes.Array,
  x: SchemaTypes.Number,
  z: SchemaTypes.Number,
})

/**
 * Exports the claims schema.
 */
export {
  claimSchema,
}
