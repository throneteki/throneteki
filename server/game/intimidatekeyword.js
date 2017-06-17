const BaseAbility = require('./baseability.js');

class IntimidateKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Intimidate';
    }

    meetsRequirements(context) {
        return context.challenge.isAttackerTheWinner();
    }

    isCardAbility() {
        return false;
    }

    executeHandler(context) {
        let {game, challenge, source} = context;
        let strength = challenge.strengthDifference;

        if(!challenge.loser.anyCardsInPlay(card => this.canIntimidate(card, strength, challenge))) {
            return false;
        }

        game.promptForSelect(challenge.winner, {
            activePromptTitle: 'Choose and kneel a character with ' + strength + ' strength or less',
            cardCondition: card => this.canIntimidate(card, strength, challenge),
            gameAction: 'kneel',
            onSelect: (player, targetCard) => this.intimidate(game, source, targetCard)
        });
    }

    canIntimidate(card, strength, challenge) {
        return !card.kneeled
            && card.controller === challenge.loser
            && card.location === 'play area'
            && card.getType() === 'character'
            && card.getStrength() <= strength;
    }

    intimidate(game, sourceCard, targetCard) {
        targetCard.controller.kneelCard(targetCard);
        game.addMessage('{0} uses intimidate from {1} to kneel {2}', sourceCard.controller, sourceCard, targetCard);
        return true;
    }
}

module.exports = IntimidateKeyword;
