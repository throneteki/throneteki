import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SavedByTheWatch extends DrawCard {
    // Saved by the Watch (25090)
    // Reaction: After an opponent's character is sacrificed or discarded from play, kneel your
    // faction card to put that character into play. Then, attach Saved by the Watch to that
    // character as a Condition attachment with the text: "Terminal. Take control of attached
    // character."
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    isCharacterControlledByOpponent(event.cardStateWhenDiscarded, context),
                onSacrificed: (event, context) =>
                    isCharacterControlledByOpponent(event.cardStateWhenSacrificed, context)
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} kneels their faction card and plays {source} to put {character} into play',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.event.card })).then({
                message: {
                    format: 'Then {player} attaches {source} to {character}',
                    args: { character: (context) => context.parentContext.event.card }
                },
                gameAction: GameActions.attach((context) => ({
                    player: context.player,
                    attachment: context.source,
                    target: context.parentContext.event.card,
                    playingType: 'play',
                    asAttachment: {
                        keywords: ['Terminal'],
                        traits: ['Condition'],
                        effect: ability.effects.takeControl(context.player)
                    }
                }))
            })
        });
    }
}

function isCharacterControlledByOpponent(card, context) {
    return (
        card.controller !== context.player &&
        card.getType() === 'character' &&
        card.location === 'play area'
    );
}

SavedByTheWatch.code = '25090';

export default SavedByTheWatch;
