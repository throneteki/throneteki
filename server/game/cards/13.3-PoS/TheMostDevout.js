import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import GameActions from '../../GameActions/index.js';

class TheMostDevout extends DrawCard {
    // The Most Devout (13057)
    // No attachments except The Seven.
    // Reaction: After a character enters play under an opponent's control, if another character
    // entered play under that player's control this phase, The Most Devout gains 1 power. (Limit
    // once per phase.)
    setupCardAbilities(ability) {
        const tracker = CardEntersPlayTracker.forPhase(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller !== context.player &&
                    event.card.getType() === 'character' &&
                    tracker.events.filter(
                        (entered) =>
                            entered.card.controller === event.card.controller &&
                            entered.card.getType() === 'character'
                    ).length > 1
            },
            message: '{player} uses {source} to gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 })),
            limit: ability.limit.perPhase(1)
        });
    }
}

TheMostDevout.code = '13057';

export default TheMostDevout;
