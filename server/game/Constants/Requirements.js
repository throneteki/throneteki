/**
 * Reasons an ability can't be used, as returned by `BaseAbility.getUnmetRequirement`.
 */
export const Requirements = Object.freeze({
    blank: 'blank',
    cannotTrigger: 'cannotTrigger',
    condition: 'condition',
    cost: 'cost',
    facedown: 'facedown',
    limit: 'limit',
    location: 'location',
    noEffect: 'noEffect',
    phase: 'phase',
    player: 'player',
    restriction: 'restriction',
    target: 'target',
    trigger: 'trigger',
    window: 'window'
});
