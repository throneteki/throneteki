const LegacyHelpers = [
    'addDuplicate',
    'addGold',
    'addPower',
    'attach',
    'discardAtRandom',
    'discardCard',
    'discardCards',
    'discardFromDraw',
    'discardFromPlay',
    'drawCardsToHand',
    'killCharacter',
    'killCharacters',
    'kneelCard',
    'modifyGold',
    'modifyPower',
    'modifyToken',
    'moveCard',
    'movePower',
    'placeCardInPile',
    'putIntoPlay',
    'putIntoShadows',
    'removeAttachment',
    'removeCardFromGame',
    'removeCardFromPile',
    'removeDuplicate',
    'returnCardToHand',
    'sacrificeCard',
    'shuffleDrawDeck',
    'standCard',
    'takeControl',
    'transferGold'
];
const CardState = ['controller', 'facedown', 'gold', 'kneeled', 'location', 'power'];

export const Rules = {
    'generic-handler': {
        selector:
            "CallExpression[callee.object.name='GameActions'][callee.property.name='genericHandler']",
        message: 'Use a declarative game action instead of a generic callback'
    },
    'legacy-helper': {
        selector: `CallExpression[callee.type='MemberExpression'][callee.object.name!='GameActions'][callee.object.property.name!=/^(effects|costs)$/][callee.property.name=/^(${LegacyHelpers.join('|')})$/]`,
        message: 'Use a GameAction instead of the legacy helper'
    },
    'direct-state-write': {
        selector: `AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(${CardState.join('|')})$/], UpdateExpression[argument.type='MemberExpression'][argument.property.name=/^(${CardState.join('|')})$/]`,
        message: 'Change game state through a GameAction'
    },
    'add-message': {
        selector: "CallExpression[callee.property.name='addMessage']",
        message: "Use the ability's message property"
    },
    'game-listener': {
        selector:
            "CallExpression[callee.property.name=/^(on|once)$/][callee.object.property.name='game']",
        message: 'Use GameActions.delayedEffect instead of listening for game events'
    },
    'event-registration': {
        selector: "CallExpression[callee.property.name='registerEvents']",
        message:
            'Use a triggered ability or GameActions.delayedEffect instead of registering for events'
    },
    'this-in-ability': {
        selector: 'ArrowFunctionExpression ThisExpression',
        message:
            'Use context.source, context.player or context.game instead of this, so the ability follows the card when control changes'
    },
    'prompt-for-select': {
        selector: "CallExpression[callee.property.name='promptForSelect']",
        message: 'Use a target instead of prompting inside a handler'
    }
};
