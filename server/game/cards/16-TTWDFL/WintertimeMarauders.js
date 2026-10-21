import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WintertimeMarauders extends DrawCard {
    // Wintertime Marauders (16003)
    // While there are more Summer plot cards than Winter plot cards revealed, Wintertime Marauders
    // cannot be declared as an attacker or defender.
    // Reaction: After you win a challenge in which Wintertime Marauders is participating, if there
    // are more Winter plot cards than Summer plot cards revealed, choose a non-unique card and
    // discard it from play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasMorePlotsWithTraitThan('Summer', 'Winter'),
            match: this,
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    this.hasMorePlotsWithTraitThan('Winter', 'Summer')
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.isMatch({
                        location: 'play area',
                        unique: false,
                        type: ['attachment', 'character', 'location']
                    }),
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target} from play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardCard((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }

    hasMorePlotsWithTraitThan(trait1, trait2) {
        return (
            this.game.getNumberOfPlotsWithTrait(trait1) >
            this.game.getNumberOfPlotsWithTrait(trait2)
        );
    }
}

WintertimeMarauders.code = '16003';

export default WintertimeMarauders;
