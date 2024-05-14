import DrawCard from '../../drawcard.js';

class TheSongOfTheSeven extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onDominanceDetermined: (event) =>
                    event.winner &&
                    this.controller !== event.winner &&
                    event.winner.faction.power >= 1
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven')
            },
            handler: (context) => {
                let otherPlayer = context.event.winner;
                let power = Math.min(otherPlayer.faction.power, 2);
                this.game.movePower(otherPlayer.faction, context.target, power);

                this.game.addMessage(
                    "{0} plays {1} to move {2} power from {3}'s faction to {4}",
                    this.controller,
                    this,
                    power,
                    otherPlayer,
                    context.target
                );
            }
        });
    }
}

TheSongOfTheSeven.code = '08098';

export default TheSongOfTheSeven;
