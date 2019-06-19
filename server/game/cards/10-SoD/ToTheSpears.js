const DrawCard = require('../../drawcard');
const {ChallengeTracker} = require('../../EventTrackers');

class ToTheSpears extends DrawCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.action({
            title: 'Have characters not kneel next challenge',
            condition: () => this.controller.getNumberOfUsedPlots() >= 3,
            handler: context => {
                let numInitiated = this.tracker.count({ attackingPlayer: context.player });
                let martellCharacters = context.player.filterCardsInPlay(card => card.getType() === 'character' && card.isFaction('martell'));

                this.untilEndOfPhase(ability => ({
                    condition: () => this.tracker.count({ attackingPlayer: context.player }) <= numInitiated,
                    match: martellCharacters,
                    effect: ability.effects.doesNotKneelAsAttacker()
                }));

                this.game.addMessage('{0} plays {1} to have each {2} character they control not kneel during the next challenge they initiate this phase',
                    context.player, this, 'martell');
            }
        });
    }
}

ToTheSpears.code = '10024';

module.exports = ToTheSpears;
