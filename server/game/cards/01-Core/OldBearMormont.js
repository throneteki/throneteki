const DrawCard = require('../../drawcard');
const { ChallengeTracker } = require('../../EventTrackers');

class OldBearMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay((card) => card.name === 'The Wall'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    !this.tracker.some({ defendingPlayer: this.controller, loser: this.controller })
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.isFaction('thenightswatch') &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);

                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their hand',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

OldBearMormont.code = '01126';

module.exports = OldBearMormont;
