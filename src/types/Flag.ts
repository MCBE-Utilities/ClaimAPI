// Type imports
import type { Document } from 'beapi-core'
import type { Claim } from './Claim.js'

/**
 * Main interface for Flags.
 */
export interface Flaged {
  inClaim: boolean
  claim?: (Document<Claim> & Claim) | undefined
}
