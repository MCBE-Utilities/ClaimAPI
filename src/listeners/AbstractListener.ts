// Type imports.
import type { LandClaims } from '../index.js'

export default abstract class {
  /**
   * Protected client circular reference.
   */
  protected abstract readonly claims: LandClaims

  /**
   * Public name for listener reference.
   */
  public abstract readonly name: string
}
