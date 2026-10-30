const actionRequirementReasons = {
    blank: 'This card is blank',
    cannotTrigger: 'Something prevents it from being triggered',
    condition: 'Its conditions are not met',
    cost: 'You cannot pay the cost',
    facedown: 'This card is facedown',
    limit: 'Its limit has been reached',
    location: 'It cannot be used from here',
    noEffect: 'It would have no effect',
    phase: 'It cannot be used this phase',
    player: 'You cannot use it',
    restriction: 'A restriction prevents it',
    target: 'There are no legal targets',
    trigger: 'Its trigger has not occurred',
    window: 'It is not your turn to act'
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
    reason ? actionRequirementReasons[reason] || 'It is unavailable right now' : undefined;

export const isNotableRequirement = (reason) => !!reason && !selfEvidentReasons.has(reason);
