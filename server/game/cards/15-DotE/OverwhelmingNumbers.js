const DrawCard = require('../../drawcard');

class OverwhelmingNumbers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put characters into play',
            condition: context => this.getNumberOfAttackingDothraki(context) >= 2,
            target: {
                type: 'select',
                numCards: 2,
                cardCondition: (card, context) => (
                    card.isMatch({ trait: 'Dothraki', type: 'character', location: ['hand', 'discard pile'] }) &&
                    card.controller === context.player &&
                    context.player.canPutIntoPlay(card)
                )
            },
            handler: context => {
                for(const card of context.target) {
                    context.player.putIntoPlay(card, 'play', { kneeled: true });
                    this.game.currentChallenge.addAttacker(card);
                    this.atEndOfChallenge(ability => ({
                        match: card,
                        effect: ability.effects.returnToHandIfStillInPlay(true, 'challenge')
                    }));
                }

                this.game.addMessage('{0} plays {1} to put {2} into play from their hand knelt, participating as attackers',
                    context.player, this, context.target);
            },
            max: ability.limit.perChallenge(1)
        });
    }

    getNumberOfAttackingDothraki(context) {
        return context.player.getNumberOfCardsInPlay({ trait: 'Dothraki', type: 'character', attacking: true });
    }
}

OverwhelmingNumbers.code = '15022';

module.exports = OverwhelmingNumbers;
