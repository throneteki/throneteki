import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class OldBearMormont extends DrawCard {
    // Old Bear Mormont (01126)
    // While you control The Wall, Old Bear Mormont does not kneel when declared as a defender.
    // Interrupt: When the challenges phase ends, if you have not lost a challenge as the defending
    // player this phase, put a [thenightswatch] card into play from your hand.
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

export default OldBearMormont;
