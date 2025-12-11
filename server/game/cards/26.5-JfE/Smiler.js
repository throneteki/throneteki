import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Smiler extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.parent.isAttacking() &&
                    event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to give {parent} renown or intimidate until the end of the challenge',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.choose({
                title: () => `Choose keyword for ${this.parent}`,
                message: {
                    format: '{player} chooses to have {parent} gain {keyword} until the end of the challenge',
                    args: {
                        parent: () => this.parent,
                        keyword: (context) => context.selectedChoice.text.toLowerCase()
                    }
                },
                choices: {
                    Renown: GameActions.genericHandler((context) =>
                        this.gainKeyword(context.selectedChoice.text.toLowerCase())
                    ),
                    Intimidate: GameActions.genericHandler((context) =>
                        this.gainKeyword(context.selectedChoice.text.toLowerCase())
                    )
                }
            })
        });
    }

    gainKeyword(keyword) {
        this.untilEndOfChallenge((ability) => ({
            match: this.parent,
            effect: ability.effects.addKeyword(keyword)
        }));
        return true;
    }
}

Smiler.code = '26084';

export default Smiler;
