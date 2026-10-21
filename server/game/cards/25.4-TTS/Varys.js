import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Varys extends DrawCard {
    // Varys (25077)
    // Bestow (2). Stealth.
    // Action: Discard 1 gold from Varys to name a card. Until the end of the phase, that card
    // cannot be marshaled, played, or put into play. (Limit once per phase.)
    // Reaction: After a Scheme plot card is revealed, Varys gains 1 gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Name a card',
            cost: ability.costs.discardGold(),
            message: '{player} discards 1 gold from {source} to name a card',
            handler: (context) => {
                this.game.promptForCardName({
                    player: context.player,
                    onSelect: (player, cardName) => this.selectCardName(cardName),
                    source: context.source
                });
            }
        });

        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Scheme')
            },
            message: '{player} uses {source} to place 1 gold on {source}',
            gameAction: GameActions.placeToken({ card: this, token: Tokens.gold })
        });
    }

    selectCardName(cardName) {
        this.game.addMessage(
            'Until the end of the phase, {0} cannot be marshaled, played or put into play',
            cardName
        );
        this.untilEndOfPhase((ability) => ({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                ),
                ability.effects.cannotPlay(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                ),
                ability.effects.cannotPutIntoPlay(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                )
            ]
        }));
    }
}

Varys.code = '25077';

export default Varys;
