// Type imports
import type { LandClaims } from '../index.js'
import type { Player } from 'beapi-core'
import type { Flaged } from '../types/index.js'

// Imports.
import AbstactListener from './AbstractListener.js'
import { getCoordinatesBetween } from 'beapi-core'

/**
 * Module listener.
 */
class Flag extends AbstactListener {
  /**
   * Protected claims reference.
   */
  protected readonly claims: LandClaims
  /**
   * Public listener name.
   */
  public readonly name: string

  /**
   * Map of all flagged players.
   */
  public readonly flagged = new Map<Player, Flaged>()

  /**
   * Construct Listener.
   * @param {LandClaims} claims LandClaims instance.
   */
  public constructor(claims: LandClaims) {
    super()
    this.claims = claims
    this.name = 'Flag'
    this.claims.getClient().on('Tick', () => {
      for (const claim of this.claims.getDatabase().findAll({})) {
        for (const player of this.claims.getClient().players.getAllAsArray()) {
          const center = [claim.x, claim.z]
          const corners = this.claims.generateCorners(center[0], center[1])
          const blocks = getCoordinatesBetween([corners[0].x, 0, corners[0].z], [corners[3].x, 0, corners[3].z])
          const location = player.getLocation()
          if (!blocks.find((cord) => cord[0] === location.x && cord[2] === location.z)) {
            if (!this.flagged.has(player)) continue
            const _claim = this.flagged.get(player).claim
            if(_claim.id !== claim.id) continue;
            // Emit the player that left the claim.
            this.claims.emit('LeftClaim', {
              player,
              claim,
            })
            this.flagged.delete(player)
            continue
          }
          if (this.flagged.has(player)) continue
          this.flagged.set(player, {
            inClaim: true,
            claim,
          })
          // Emit the player that entered the claim.
          this.claims.emit('EnteredClaim', {
            player,
            claim,
          })
        }
      }
    })
  }
}

/**
 * Export listener.
 */
export {
  Flag,
}
 
