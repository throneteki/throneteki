import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class ChellaDaughterOfCheyk extends DrawCard {
    // Chella Daughter of Cheyk (05007)
    // Chella Daughter of Cheyk gets +1 STR for each ear token she has. While she has 3 or more ear
    // tokens, she gains intimidate and renown.
    // Reaction: After a character is killed during a challenge in which Chella Daughter of Cheyk is
    // attacking, place an ear token on her.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.tokens[Tokens.ear]
            )
        });

        this.persistentEffect({
            condition: (context) => context.source.tokens[Tokens.ear] >= 3,
            match: this,
            effect: [ability.effects.addKeyword('Intimidate'), ability.effects.addKeyword('Renown')]
        });

        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    context.source.isAttacking() && event.card !== context.source
            },
            message: '{player} uses {source} to place 1 ear token to {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.ear
            }))
        });
    }
}

ChellaDaughterOfCheyk.code = '05007';

export default ChellaDaughterOfCheyk;
