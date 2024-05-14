const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Silence extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 2
        });

        const getEuron = (player) =>
            player.cardsInPlay.find((card) => card.name === "Euron Crow's Eye");

        this.action({
            title: 'Put card into play',
            phase: 'challenge',
            cost: [ability.costs.kneelSelf()],
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: {
                    type: 'location',
                    location: 'hand',
                    controller: 'current',
                    trait: 'Warship',
                    condition: (card, context) =>
                        GameActions.putIntoPlay({ player: context.player, card: card }).allow()
                }
            },
            message: '{player} uses and kneels {source} to put {target} into play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target
                    })).then({
                        condition: (context) => !!getEuron(context.player),
                        message: {
                            format: 'Then {player} stands {euron}',
                            args: { euron: (context) => getEuron(context.player) }
                        },
                        gameAction: GameActions.standCard((context) => ({
                            card: getEuron(context.player)
                        }))
                    }),
                    context
                );
            }
        });
    }
}

Silence.code = '12016';

module.exports = Silence;
