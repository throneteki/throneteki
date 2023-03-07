const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');

class TheFieldOfFire extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.game.isDuringChallenge() && this.game.currentChallenge.anyParticipants(card => !card.hasTrait('Dragon')),
            message: {
                format: '{player} plays {source} to give {reductions} until the end of the phase',
                args: { reductions: context => Array.from(this.getReductions(context), ([reduction, characters]) => Message.fragment('{characters} -{reduction} STR', { characters, reduction })) }
            },
            phase: 'challenge',
            handler: context => {
                Array.from(this.getReductions(context)).forEach(([reduction, characters]) => {
                    this.untilEndOfPhase(ability => ({
                        match: characters,
                        targetController: 'any',
                        effect: ability.effects.modifyStrength(-reduction)
                    }));
                });
            }
        });
    }

    getReductions(context) {
        let numDragons = context.player.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.hasTrait('Dragon'));
        let reductions = new Map();
        for(let participant of context.game.currentChallenge.getParticipants()) {
            if(!participant.hasTrait('Dragon')) {
                let amount = numDragons * (participant.hasTrait('Army') ? 3 : 1);
                let reduction = reductions.get(amount) || [];
                reductions.set(amount, reduction.concat([participant]));
            }
        }
        return reductions;
    }
}

TheFieldOfFire.code = '24021';

module.exports = TheFieldOfFire;
