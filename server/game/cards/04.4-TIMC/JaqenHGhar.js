import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class JaqenHGhar extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isUnique()
            },
            message: '{player} uses {source} to add Valar Morghulis tokens to {target}',
            handler: (context) => {
                this.selectedCards = context.target;
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) =>
                            GameActions.placeToken({
                                card,
                                token: Tokens.valarmorghulis
                            })
                        )
                    ),
                    context
                );
            }
        });

        this.reaction({
            when: {
                afterChallenge: () =>
                    this.game.isDuringChallenge({ winner: this.controller, attackingAlone: this })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasToken(Tokens.valarmorghulis),
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    onCardLeftPlay(event) {
        if (event.card !== this) {
            return;
        }

        if (!this.selectedCards) {
            return;
        }

        for (let card of this.selectedCards) {
            card.modifyToken(Tokens.valarmorghulis, -1);
        }

        this.selectedCards = null;
    }
}

JaqenHGhar.code = '04077';

export default JaqenHGhar;
