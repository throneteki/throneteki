import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerGuyardMorrigen extends DrawCard {
    // Ser Guyard Morrigen (20037)
    // Bestow (1).
    // Each Rainbow Guard character you control with 1 or more gold gains an [intrigue] icon.
    // Reaction: After a Summer plot card is revealed, place 1 gold from the treasury on, either: a
    // Knight character, or each Rainbow Guard character you control. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.getType() === 'character' &&
                card.hasToken(Tokens.gold) &&
                card.hasTrait('Rainbow Guard') &&
                card.controller === context.source.controller,
            effect: ability.effects.addIcon('intrigue')
        });
        this.reaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Summer'))
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.choose({
                title: 'Knight or Rainbow Guard?',
                choices: {
                    Knight: {
                        message: '{player} uses {source} to have a Knight character gain 1 gold',
                        gameAction: GameActions.chooseCards({
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.getType() === 'character' &&
                                card.hasTrait('Knight'),
                            gameAction: (card) =>
                                GameActions.placeToken({ card, token: Tokens.gold })
                        })
                    },
                    'Rainbow Guard': {
                        message: '{player} uses {source} to have each Rainbow Guard gain 1 gold',
                        gameAction: GameActions.simultaneously((context) =>
                            context.player
                                .filterCardsInPlay(
                                    (card) =>
                                        card.hasTrait('Rainbow Guard') &&
                                        card.getType() === 'character'
                                )
                                .map((card) => GameActions.placeToken({ card, token: Tokens.gold }))
                        )
                    }
                }
            })
        });
    }
}

SerGuyardMorrigen.code = '20037';

export default SerGuyardMorrigen;
