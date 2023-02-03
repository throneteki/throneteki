const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheShadowTower extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.controller === this.controller && card.owner !== this.controller,
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.defendingPlayer === this.controller
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => card.location === 'shadows' && card.controller === context.event.challenge.loser,
                gameAction: 'reveal'
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({ 
                        cards: [context.target], 
                        player: context.player
                    })).then({
                        condition: context => context.event.cards[0].isMatch({ type: 'character' }) && context.event.revealed.length > 0,
                        gameAction: GameActions.may({
                            title: context => `Sacrifice to take control of ${context.event.revealed[0].name}?`,
                            message: '{player} {gameAction}',
                            gameAction: GameActions.putIntoPlay(context => ({
                                player: context.player,
                                card: context.event.revealed[0]
                            }))
                        })
                    })
                    , context
                );
            }
        });
    }
}

TheShadowTower.code = '24014';

module.exports = TheShadowTower;
