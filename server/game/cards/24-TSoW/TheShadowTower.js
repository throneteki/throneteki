const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheShadowTower extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.owner !== this.controller,
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Reveal card in shadows',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'shadows' && card.controller !== this.controller,
                gameAction: 'reveal'
            },
            message: '{source} kneels {costs.kneel} to reveal a card in shadows',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        cards: [context.target],
                        player: context.player
                    })).then({
                        condition: (context) =>
                            context.event.cards[0].isMatch({ type: 'character', unique: false }) &&
                            context.event.revealed.length > 0,
                        message: '{player} {gameAction}',
                        gameAction: GameActions.putIntoPlay((context) => ({
                            card: context.event.cards[0],
                            player: context.player
                        }))
                    }),
                    context
                );
            }
        });
    }
}

TheShadowTower.code = '24014';

module.exports = TheShadowTower;
