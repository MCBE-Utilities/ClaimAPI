// Type imports.
import type { Player, Document, ItemInteractEvent, BlockDestroyedEvent } from "beapi-core"

/**
 * Main interface for a claim.
 */
export interface Claim {
  id: string
  owner: string
  members: string[]
  x: number
  z: number
}

export interface ClaimCord {
  x: number
  z: number
}

export interface LandClaimsEvents {
  ClaimCreated: [ClaimCreatedEvent]
  EnteredClaim: [ClaimEvent]
  LeftClaim: [ClaimEvent]
  InteractionBlocked: [InteractionBlockedEvent]
  BlockDestoryedBlocked: [BlockDestoryedBlockedEvent] 
}

export interface ClaimCreatedEvent {
  player: Player | string
  claim: Document<Claim> & Claim
}

export interface ClaimEvent {
  player: Player
  claim: Document<Claim> & Claim
}

export interface InteractionBlockedEvent {
  player: Player
  claim: Claim
  event: ItemInteractEvent
}

export interface BlockDestoryedBlockedEvent {
  player: Player
  claim: Claim
  event: BlockDestroyedEvent
}
