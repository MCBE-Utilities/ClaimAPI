// Imports
import { modal } from 'beapi-core'
import { claimSchema } from '../index.js'

/**
 * Creates the modal for claims.
 */
const claimModal = modal('claims', claimSchema)

/**
 * Exports the claims modal.
 */
export {
  claimModal
}
