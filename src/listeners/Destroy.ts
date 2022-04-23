// Type imports.
import type { LandClaims } from '../index.js'

// Imports.
import { getCoordinatesBetween } from 'beapi-core'
import AbstactListener from './AbstractListener.js'

/**
 * Module listener.
 */
class Destroy extends AbstactListener {
  /**
   * Protected claims reference.
   */
  protected readonly claims: LandClaims
  /**
   * Public listener name.
   */
  public readonly name: string

  /**
   * Construct Listener.
   * @param {LandClaims} claims LandClaims instance.
   */
  public constructor(claims: LandClaims) {
    super()
    this.claims = claims
    this.name = 'Destroy'
    this.claims.getClient().on('BlockDestroyed', (data) => {
      for (const claim of this.claims.getDatabase().findAll({})) {
        const player = data.player
        const center = [claim.x, claim.z]
        const corners = this.claims.generateCorners(center[0], center[1])
        const blocks = getCoordinatesBetween([corners[0].x, 0, corners[0].z], [corners[3].x, 0, corners[3].z])
        const location = data.block.getLocation()
        if (!blocks.find((cord) => cord[0] === location.x && cord[2] === location.z)) continue
        if (claim.owner === player.getName() || claim.members.find((x) => x === player.getName())) return
        data.cancel()
        return this.claims.emit('DestroyBlocked', {
          player,
          claim,
          event: data,
        })
      }
    })
  }
}
 
 /**
  * Export listener.
  */
 export {
   Destroy,
 }
 