import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class KindlyMan extends DrawCard {
    // Kindly Man (20044)
    // Ambush (4). Shadow (2).
    // Reaction: After Kindly Man stands, choose an agenda or a card in play and, either: place a
    // non-gold, non-power token of your choice on that card; or discard a non-gold, non-power token
    // from that card. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this
            },
            limit: ability.limit.perRound(3),
            target: {
                activePromptTitle: 'Select card to gain or lose a token',
                cardCondition: (card) =>
                    ['active plot', 'faction', 'play area', 'agenda'].includes(card.location),
                cardType: ['agenda', 'attachment', 'character', 'faction', 'location', 'plot']
            },
            handler: (context) => {
                this.context = context;
                let buttons = [
                    { text: 'Gain token', method: 'changeToken', arg: 'gain' },
                    { text: 'Lose token', method: 'changeToken', arg: 'lose' }
                ];
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Gain or lose Token?',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    changeToken(player, gainOrLose) {
        this.context.gainOrLose = gainOrLose;
        let tokenArray = Tokens.list().filter((token) => token !== 'gold' && token !== 'power');
        this.context.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select Token',
                controls: [
                    {
                        type: 'select-from-values',
                        command: 'menuButton',
                        method: 'tokenSelected',
                        selectableValues: tokenArray
                    }
                ]
            },
            source: this.context.source
        });
        return true;
    }

    tokenSelected(player, token) {
        const action =
            this.context.gainOrLose === 'gain' ? GameActions.placeToken : GameActions.discardToken;
        this.game.resolveGameAction(
            action((context) => ({ card: context.target, token: token })),
            this.context
        );
        let tokenMessage =
            this.context.gainOrLose === 'gain'
                ? 'to have {2} gain 1 {3} token'
                : 'to discard 1 {3} token from {2}';
        this.game.addMessage(
            '{0} uses {1} ' + tokenMessage,
            player,
            this,
            this.context.target,
            token
        );

        return true;
    }
}

KindlyMan.code = '20044';

export default KindlyMan;
