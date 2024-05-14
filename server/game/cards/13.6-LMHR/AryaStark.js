const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class AryaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);

        this.selectedCards = [];
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 5,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.player
            },
            message: '{player} uses {source} to place prayer tokens on {target}',
            handler: (context) => {
                this.selectedCards = context.target;
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) =>
                            GameActions.placeToken({
                                card,
                                token: Tokens.prayer
                            })
                        )
                    ),
                    context
                );
            }
        });

        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.cardStateWhenKilled.hasToken(Tokens.prayer) &&
                    ((this.allowGameAction('stand') && this.kneeled) || this.controller.canDraw())
            },
            handler: (context) => {
                const standAction = GameActions.standCard({ card: this });
                const drawAction = GameActions.drawCards({ player: context.player, amount: 1 });

                let messageSegments = [];

                if (standAction.allow(context)) {
                    messageSegments.push('stand {1}');
                }

                if (drawAction.allow(context)) {
                    messageSegments.push('draw 1 card');
                }

                const message = '{0} uses {1} to ' + messageSegments.join(', and ');
                this.game.addMessage(message, context.player, this);

                this.game.resolveGameAction(
                    GameActions.simultaneously([standAction, drawAction]),
                    context
                );
            }
        });
    }

    onCardLeftPlay(event) {
        this.selectedCards = this.selectedCards.filter((card) => card !== event.card);

        if (event.card !== this) {
            return;
        }

        this.game.addMessage(
            '{0} discards {1} tokens from {2} because {3} leaves play',
            this.controller,
            Tokens.prayer,
            this.selectedCards,
            this
        );

        for (let card of this.selectedCards) {
            card.modifyToken(Tokens.prayer, -1);
        }

        this.selectedCards = [];
    }
}

AryaStark.code = '13101';

module.exports = AryaStark;
