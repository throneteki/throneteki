/**
 * Reasons an ability can't be used, as returned by `BaseAbility.getUnmetRequirement`.
 */
export const Requirements = Object.freeze({
    /** The card's text is blank. */
    blank: 'blank',
    /** An effect stops the player triggering it, or using the keyword. */
    cannotTrigger: 'cannotTrigger',
    /** The ability's own condition is not met. */
    condition: 'condition',
    /** Its costs can't be paid. */
    cost: 'cost',
    /** The card is facedown. */
    facedown: 'facedown',
    /** It has reached its limit or max. */
    limit: 'limit',
    /** The card is not in a location it can be used from. */
    location: 'location',
    /** Resolving it could not change the game state. */
    noEffect: 'noEffect',
    /** It can't be used in the current phase. */
    phase: 'phase',
    /** The player is not allowed to use it, or there is no player it could choose. */
    player: 'player',
    /** A rule or effect stops the card being played or put into play this way. */
    restriction: 'restriction',
    /** There are not enough legal targets. */
    target: 'target',
    /** Its triggering condition has not occurred. */
    trigger: 'trigger'
});
