import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Silence extends DrawCard {
    // Silence (12016)
    // Challenges Action: Kneel Silence to put a Warship location into play from your hand. Then, if
    // you control Euron Crow's Eye, stand him.
    // +2 Initiative.
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
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            })).then((context) => ({
                condition: (context) => !!getEuron(context.player),
                message: {
                    format: 'Then {player} stands {euron}',
                    args: { euron: (context) => getEuron(context.player) }
                },
                gameAction: GameActions.standCard((context) => ({
                    card: getEuron(context.player)
                }))
            }))
        });
    }
}

Silence.code = '12016';

export default Silence;
