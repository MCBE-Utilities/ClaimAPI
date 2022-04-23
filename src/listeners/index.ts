// Import listeners
import { Flag } from './Flag.js'
import { Interaction } from './Interaction.js'
import { Destroy } from './Destroy.js'

/**
 * Array of listeners.
 */
const defaultListeners = [
  Flag,
  Interaction,
  Destroy,
]

/**
 * Export listeners.
 */
export {
  defaultListeners,
}
