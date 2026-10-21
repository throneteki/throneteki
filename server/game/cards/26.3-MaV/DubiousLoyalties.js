import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DubiousLoyalties extends DrawCard {
    // Dubious Loyalties (26052)
    // Non-loyal character you own only.
    // Attached character gains the House Bolton trait, stealth, and renown.
    // Reaction: After you win a challenge by 5 or more STR, discard the top card of your deck to
    // take control of attached character. (Any player may initiate this ability.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ loyal: false, owner: 'current' });
        this.whileAttached({
            match: this.parent,
            effect: [
                ability.effects.addKeyword('Stealth'),
                ability.effects.addKeyword('Renown'),
                ability.effects.addTrait('House Bolton')
            ]
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    !!event.challenge.winner && event.challenge.strengthDifference >= 5
            },
            player: () => this.game.currentChallenge.winner,
            cost: ability.costs.discardFromDeck(),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromDeck} from the top of their deck to take control of {parent}',
                args: {
                    parent: () => this.parent
                }
            },
            gameAction: GameActions.takeControl((context) => ({
                card: this.parent,
                player: context.player
            }))
        });
    }
}

DubiousLoyalties.code = '26052';

export default DubiousLoyalties;
