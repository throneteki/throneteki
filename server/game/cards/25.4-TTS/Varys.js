import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Varys extends DrawCard {
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

        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Scheme')
            },
            message: '{player} uses {source} to place 1 gold on {source}',
            gameAction: GameActions.placeToken({ card: this, token: Tokens.gold })
        });
    }
}

Varys.code = '25077';

export default Varys;
