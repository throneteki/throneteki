import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class OldBearMormont extends DrawCard {
    // Old Bear Mormont (01126)
    // While you control The Wall, Old Bear Mormont does not kneel when declared as a defender.
    // Interrupt: When the challenges phase ends, if you have not lost a challenge as the defending
    // player this phase, put a [thenightswatch] card into play from your hand.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay((card) => card.name === 'The Wall'),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    !context.source.tracker.some({
                        defendingPlayer: context.source.controller,
                        loser: context.source.controller
                    })
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.isFaction('thenightswatch') &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

OldBearMormont.code = '01126';

export default OldBearMormont;
