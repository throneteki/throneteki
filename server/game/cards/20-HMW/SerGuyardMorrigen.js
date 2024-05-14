const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class SerGuyardMorrigen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.hasToken(Tokens.gold) &&
                card.hasTrait('Rainbow Guard') &&
                card.controller === this.controller,
            effect: ability.effects.addIcon('intrigue')
        });

        this.reaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Summer'))
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.context = context;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Knight or Rainbow Guard?',
                        buttons: [
                            { text: 'Knight', method: 'knight' },
                            { text: 'Rainbow Guard', method: 'rainbowguard' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    knight(player) {
        this.game.promptForSelect(player, {
            source: this,
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.hasTrait('Knight'),
            onSelect: (player, card) => this.onKnightSelected(player, card),
            onCancel: (player) => this.onKnightCanceled(player)
        });

        return true;
    }

    onKnightSelected(player, card) {
        this.game.resolveGameAction(
            GameActions.placeToken(() => ({ card: card, token: Tokens.gold })),
            this.context
        );
        this.game.addMessage('{0} uses {1} to have {2} gain 1 gold', player, this, card);
        return true;
    }

    onKnightCanceled(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }

    rainbowguard(player) {
        let rainbow = player.filterCardsInPlay(
            (card) => card.hasTrait('Rainbow Guard') && card.getType() === 'character'
        );

        for (let card of rainbow) {
            this.game.resolveGameAction(
                GameActions.placeToken(() => ({ card: card, token: Tokens.gold })),
                this.context
            );
        }

        this.game.addMessage('{0} uses {1} to have each Rainbow Guard gain 1 gold', player, this);

        return true;
    }
}

SerGuyardMorrigen.code = '20037';

module.exports = SerGuyardMorrigen;
