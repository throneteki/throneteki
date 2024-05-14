const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class EliasLance extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Sand Snake' });

        this.whileAttached({
            match: (card) => card.name === 'Elia Sand',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.parent.isAttacking()
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.winner,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.event.challenge.winner &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            message: {
                format: '{player} uses {source} to have {winner} return {target} to their hand',
                args: { winner: (context) => context.event.challenge.winner }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToHand((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

EliasLance.code = '20019';

module.exports = EliasLance;
