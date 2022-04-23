/**
 * Configuration for landClaims.
 */
class Config {
  /**
   * Claim radius size.
   */
  protected claimRadius: number

  /**
   * Construct the landClaims config.
   */
  public constructor() {
    this.claimRadius = 20 * 2
  }

  /**
   * Get the claim radius size.
   * @returns {number} Claim radius size.
   * @note Default size is 20 blocks.
   */
  public getClaimRadius(): number {
    return this.claimRadius
  }

  /**
   * Set the claim radius.
   * @param radius Claim radius.
   * @note It is recommended to set the radius to an even number.
   * @note Default size is 20 blocks.
   */
  public setClaimRadius(radius: number): void {
    this.claimRadius = radius * 2
  }
}

/**
 * Export config class.
 */
export {
  Config,
}
