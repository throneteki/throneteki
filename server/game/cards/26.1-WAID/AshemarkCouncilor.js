import { Tokens } from '../../Constants/Tokens.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AshemarkCouncilor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (!card.tokens[Tokens.gold] || card.tokens[Tokens.gold] === 0)
            },
            message: '{player} uses {source} to have {target} gain 1 gold',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) =>
                            GameActions.placeToken({ card, token: Tokens.gold, amount: 1 })
                        )
                    )
                );
            }
        });
    }

    getSTR() {
        return this.game.getNumberOfCardsInPlay((card) => card.tokens[Tokens.gold] >= 1);
    }
}

AshemarkCouncilor.code = '26005';

export default AshemarkCouncilor;
