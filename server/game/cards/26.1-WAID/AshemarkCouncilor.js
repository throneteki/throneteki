import { Tokens } from '../../Constants/Tokens.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const inPlayLocations = ['play area', 'active plot', 'faction', 'duplicate'];
const inPlayCardTypes = ['attachment', 'character', 'faction', 'location', 'plot'];

function getSTR(source) {
    return source.game.allCards.filter(
        (card) => inPlayLocations.includes(card.location) && card.tokens[Tokens.gold] >= 1
    ).length;
}

class AshemarkCouncilor extends DrawCard {
    // Ashemark Councilor (26005)
    // X is the number of cards with 1 or more gold.
    // Reaction: After Ashemark Councilor enters play, choose up to 3 cards without gold. Each of
    // those cards gains 1 gold.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => getSTR(context.source))
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardType: inPlayCardTypes,
                cardCondition: (card) =>
                    inPlayLocations.includes(card.location) &&
                    (!card.tokens[Tokens.gold] || card.tokens[Tokens.gold] === 0)
            },
            message: '{player} uses {source} to have {target} gain 1 gold',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) =>
                    GameActions.placeToken({ card, token: Tokens.gold, amount: 1 })
                )
            )
        });
    }
}

AshemarkCouncilor.code = '26005';

export default AshemarkCouncilor;
