const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');

class TheFieldOfFire extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.game.isDuringChallenge() && this.game.currentChallenge.anyParticipants(card => !card.hasTrait('Dragon')),
            message: {
                format: '{player} plays {source} to give {reductions} until the end of the phase',
                args: { reductions: context => Object.entries(this.getReductions(context)).reduce((reductions, [reduction, characters]) => reductions.push(Message.fragment('{characters} -{reduction} STR', { characters, reduction })), []) }
            },
            phase: 'challenge',
            handler: context => {
                Object.entries(this.getReductions(context)).forEach(([reduction, characters]) => {
                    this.untilEndOfPhase(ability => ({
                        match: characters,
                        targetController: 'any',
                        effect: ability.effects.modifyStrength(reduction)
                    }));
                });
            }
        });
    }

    getReductions(context) {
        let numDragons = context.player.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Dragon'));
        return context.game.currentChallenge.getParticipants().reduce((reductions, participant) => {
            if(participant.hasTrait('Dragon')) {
                return;
            }

            let amount = numDragons * (participant.hasTrait('Army') ? 3 : 1);
            reductions[amount] = reductions[amount] || [];
            reductions[amount].push(participant);
        }, {});
    }
}

TheFieldOfFire.code = '24021';

module.exports = TheFieldOfFire;
