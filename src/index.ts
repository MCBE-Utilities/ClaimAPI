// Type imports
import { Client, Modal, Awaitable, Player, genUuid, Document } from 'beapi-core'
import type { Claim, ClaimCord, LandClaimsEvents, Flaged } from './types/index.js'
import type AbstactListener from './listeners/AbstractListener.js'
import type { Flag } from './listeners/Flag.js'

// Imports
import { EventEmitter } from 'beapi-core'
import { client } from './Client.js'
import { claimModal } from './database/index.js'
import { Config } from './config/index.js'
import { defaultListeners } from './listeners/index.js'

interface LandClaims {
  on<K extends keyof LandClaimsEvents>(event: K, listener: (...args: LandClaimsEvents[K]) => Awaitable<void>): void
  on<S extends string | symbol>(
    event: Exclude<S, keyof LandClaimsEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  addListener<K extends keyof LandClaimsEvents>(event: K, listener: (...args: LandClaimsEvents[K]) => Awaitable<void>): void
  addListener<S extends string | symbol>(
    event: Exclude<S, keyof LandClaimsEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  once<K extends keyof LandClaimsEvents>(event: K, listener: (...args: LandClaimsEvents[K]) => Awaitable<void>): this
  once<S extends string | symbol>(
    event: Exclude<S, keyof LandClaimsEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  emit<K extends keyof LandClaimsEvents>(event: K, ...args: LandClaimsEvents[K]): void
  emit<S extends string | symbol>(event: Exclude<S, keyof LandClaimsEvents>, ...args: unknown[]): void

  envokeEvent<K extends keyof LandClaimsEvents>(event: K, ...args: LandClaimsEvents[K]): void
  envokeEvent<S extends string | symbol>(event: Exclude<S, keyof LandClaimsEvents>, ...args: unknown[]): void

  off<K extends keyof LandClaimsEvents>(event: K, listener: (...args: LandClaimsEvents[K]) => Awaitable<void>): void
  off<S extends string | symbol>(
    event: Exclude<S, keyof LandClaimsEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  removeListener<K extends keyof LandClaimsEvents>(event: K, listener: (...args: LandClaimsEvents[K]) => Awaitable<void>): void
  removeListener<S extends string | symbol>(
    event: Exclude<S, keyof LandClaimsEvents>,
    listener: (...args: any[]) => Awaitable<void>,
  ): void

  removeListeners<K extends keyof LandClaimsEvents>(event?: K): void
  removeListeners<S extends string | symbol>(event?: Exclude<S, keyof LandClaimsEvents>): void
}

/**
 * Main class for the landClaims module.
 */
class LandClaims extends EventEmitter {
  /**
   * Protected client instance for module.
   */
  protected readonly client: Client
  /**
   * Protected database for claim data.
   */
  protected readonly database: Modal<Claim>

  /**
   * Protected config for module configuration.
   */
  protected readonly config: Config

  /**
   * Map of all loaded listeners.
   */
  protected readonly claimlisteners = new Map<string, AbstactListener>()

  /**
   * Construct the LandClaims class.
   * @param {Client} client BeAPI client instance.
   */
  public constructor(client: Client) {
    super()
    // Assign class properties
    this.client = client
    this.database = claimModal
    this.config = new Config()
    // Loads listeners
    this.loadListeners()
  }

  /**
   * Load all default listeners.
   */
  protected loadListeners(): void {
    for (const listener of defaultListeners) {
      const instance = new listener(this)
      this.claimlisteners.set(instance.name, instance)
    }
  }

  /**
   * Get the modules client instance.
   * @returns {Client} BeAPI client.
   */
  public getClient(): Client {
    return this.client
  }

  /**
   * Get the database for claims.
   * @returns {Modal<Claim>} The claims database.
   */
  public getDatabase(): Modal<Claim> {
    return this.database
  }

  /**
   * Get the modules config.
   * @returns {Config} The modules config.
   */
  public getConfig(): Config {
    return this.config
  }

  /**
   * Get all listeners.
   * @returns {Map<string, AbstactListener>} Map of all listeners.
   */
  public getListeners(): Map<string, AbstactListener> {
    return this.claimlisteners
  }

  /**
   * Gets the corners of a claim.
   * @param {number} x X Cord.
   * @param {number} z Y Cord.
   * @returns {ClaimCord[]} Array of cords.
   */
  public generateCorners(x: number, z: number): ClaimCord[] {
    const cords: ClaimCord[] = [
      {
        x: (Math.round(x + (this.config.getClaimRadius() / 2))),
        z: (Math.round(z + (this.config.getClaimRadius() / 2))),
      },
      {
        x: (Math.round(x + (this.config.getClaimRadius() / 2))),
        z: (Math.round(z - (this.config.getClaimRadius() / 2))),
      },
      {
        x: (Math.round(x - (this.config.getClaimRadius() / 2))),
        z: (Math.round(z + (this.config.getClaimRadius() / 2))),
      },
      {
        x: (Math.round(x - (this.config.getClaimRadius() / 2))),
        z: (Math.round(z - (this.config.getClaimRadius() / 2))),
      }
    ]

    return cords
  }

  /**
   * Gets all players that are in a claim.
   * @returns 
   */
  public getPlayersInClaim(): {player: Player, claim: Claim}[] {
    const flagClass = this.claimlisteners.get('Flag') as Flag
    const players: {player: Player, claim: Claim}[] = []
    for (const [player, claim] of flagClass.flagged) {
      if (!claim.inClaim) continue
      players.push({
        player,
        claim: claim.claim,
      })
    }

    return players
  }

  /**
   * 
   * @param {Player | string} owner Owner of the claim.
   * @param {number?} x Optional location for x 
   * @param {number?} z Optional location for z
   * @returns 
   */
  public createClaim(owner: Player | string, x?: number, z?: number): Document<Claim> & Claim {
    let claim
    if (owner instanceof Player) {
      claim = this.database.write({
        id: genUuid(),
        owner: owner.getName(),
        members: [],
        x: x ?? owner.getLocation().x,
        z: z ?? owner.getLocation().z,
      })
    } else {
      claim = this.database.write({
        id: genUuid(),
        owner,
        members: [],
        x: x ?? 0,
        z: z ?? 0,
      })
    }
    this.emit('ClaimCreated', {
      player: owner,
      claim,
    })

    return claim
  }
}

/**
 * Construct default landClaims class.
 */
const claims = new LandClaims(client)

/**
 * Export the default claims instance and LandClaims class.
 */
export {
  claims,
  LandClaims,
}
