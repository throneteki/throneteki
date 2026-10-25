const actionRequirementReasons = {
    blank: 'This card is blank.',
    cannotTrigger: 'This ability cannot be triggered.',
    condition: 'The conditions for this ability are not met.',
    cost: 'You cannot pay the cost.',
    facedown: 'This card is facedown.',
    limit: 'This ability has reached its usage limit.',
    location: 'This card is not in a location where it can be used.',
    noEffect: 'This ability would not change the game state.',
    phase: 'This ability cannot be used in this phase.',
    player: 'You cannot use this ability.',
    restriction: 'A restriction prevents this action.',
    target: 'There are no legal targets.',
    trigger: 'The triggering condition has not occurred.',
    window: 'It is not your opportunity to take an action.'
};

const selfEvidentReasons = new Set([
    'blank',
    'facedown',
    'location',
    'phase',
    'player',
    'trigger',
    'window'
]);

export const getActionRequirementReason = (reason) =>
    reason
        ? actionRequirementReasons[reason] || 'This action is currently unavailable.'
        : undefined;

export const isNotableRequirement = (reason) => !!reason && !selfEvidentReasons.has(reason);
