import { Client } from 'beapi-core'

/**
 * Main client for the module.
 */
const client = new Client({
  commandsDisabled: true,
})

/**
 * Export the client.
 */
export {
  client,
}
