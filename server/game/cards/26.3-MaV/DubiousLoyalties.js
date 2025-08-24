import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DubiousLoyalties extends DrawCard {
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
