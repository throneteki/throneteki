import DrawCard from '../../drawcard.js';

class Dragonstone extends DrawCard {
    // Dragonstone (24003)
    // You may choose not to stand Dragonstone during the standing phase.
    // Reaction: After a card is placed in shadows by a card effect, kneel Dragonstone. Then, until
    // Dragonstone stands or leaves play, that card cannot come out of shadows.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.reaction({
            when: {
                onCardPutIntoShadows: (event) => event.reason === 'ability'
            },
            message: {
                format: "{player} kneels {source} to prevent card #{position} in {opponent}'s shadow area from coming out of shadows until {source} stands or leaves play",
                args: {
                    position: (context) => context.event.card.getShadowPosition(),
                    opponent: (context) => context.event.card.controller
                }
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardStood: (event) => event.card === this,
                        onCardLeftPlay: (event) => event.card === this,
                        onCardMoved: (event) => event.card === context.event.card
                    },
                    effect: ability.effects.cannotBringOutOfShadows(
                        (card) => card === context.event.card
                    )
                }));
            }
        });
    }
}

Dragonstone.code = '24003';

export default Dragonstone;
