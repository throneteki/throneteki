import AgendaCard from '../../agendacard.js';

class TheFaithMilitant extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                !card.hasTrait('The Seven') &&
                ['character', 'location'].includes(card.getType()) &&
                card.controller === this.controller,
            effect: ability.effects.cannotGainPower()
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.loser.faction.power >= 1
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven') &&
                    card.isParticipating()
            },
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;
                this.game.movePower(otherPlayer.faction, context.target, 1);

                this.game.addMessage(
                    "{0} uses {1} and kneels their faction card to move 1 power from {2}'s faction to {3}",
                    this.controller,
                    this,
                    otherPlayer,
                    context.target
                );
            }
        });
    }
}

TheFaithMilitant.code = '08099';

export default TheFaithMilitant;
