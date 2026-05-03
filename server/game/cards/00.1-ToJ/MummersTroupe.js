import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/Tokens.js';

class MummersTroupe extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
        this.persistentEffect({
            condition: () => this.tokens[Tokens.gold] >= 3,
            match: this,
            effect: ability.effects.addKeyword('renown')
        });

        this.reaction({
            when: {
                onCardStood: (event) => event.card === this
            },
            limit: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    (card === this || !card.hasToken(Tokens.gold))
            },
            handler: (context) => {
                context.target.modifyToken(Tokens.gold, 1);
                this.game.addMessage(
                    '{0} uses {1} to place 1 gold from the treasury on {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

MummersTroupe.code = '00348';

export default MummersTroupe;
