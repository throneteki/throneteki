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
                onCardDiscarded: (event) =>
                    this.isCharacterControlledByOpponent(event.cardStateWhenDiscarded),
                onSacrificed: (event) =>
                    this.isCharacterControlledByOpponent(event.cardStateWhenSacrificed)
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} kneels their faction card and plays {source} to put {character} into play',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.event.card })).then({
                condition: (context) =>
                    context.player.canAttach(this, context.parentContext.event.card),
                message: {
                    format: 'Then, {player} attaches {source} to {character}',
                    args: { character: (context) => context.parentContext.event.card }
                },
                gameAction: GameActions.genericHandler((context) => {
                    context.player.attach(
                        context.player,
                        this,
                        context.parentContext.event.card,
                        'play'
                    );
                    this.lastingEffect((ability) => ({
                        condition: () => !!this.parent,
                        targetLocation: 'any',
                        match: this,
                        effect: [
                            ability.effects.setCardType('attachment'),
                            ability.effects.addKeyword('Terminal'),
                            ability.effects.addTrait('Condition')
                        ]
                    }));

                    this.lastingEffect((ability) => ({
                        condition: () => this.location === 'play area',
                        targetLocation: 'any',
                        targetController: 'any',
                        match: (card) => card === this.parent,
                        effect: ability.effects.takeControl(context.player)
                    }));
                })
            })
        });
    }

    isCharacterControlledByOpponent(card) {
        return (
            card.controller !== this.controller &&
            card.getType() === 'character' &&
            card.location === 'play area'
        );
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

SavedByTheWatch.code = '25090';

export default SavedByTheWatch;
