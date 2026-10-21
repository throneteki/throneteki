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
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    this.canGainPower() &&
                    event.card.controller !== this.controller &&
                    event.card.getType() === 'character' &&
                    this.getNumOfCharactersEnteringPlay(event.card.controller) > 1
            },
            message: '{player} uses {source} to gain 1 power',
            handler: () => {
                this.game.resolveGameAction(GameActions.gainPower({ card: this, amount: 1 }));
            },
            limit: ability.limit.perPhase(1)
        });
    }

    getNumOfCharactersEnteringPlay(opponent) {
        return this.tracker.events.reduce((count, event) => {
            if (event.card.controller === opponent && event.card.getType() === 'character') {
                return count + 1;
            }

            return count;
        }, 0);
    }
}

TheMostDevout.code = '13057';

export default TheMostDevout;
