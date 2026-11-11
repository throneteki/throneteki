import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheFaithMilitant extends AgendaCard {
    // The Faith Militant (08099)
    // Non-The Seven characters and locations you control cannot gain power.
    // Reaction: After you win a challenge, kneel your faction card to move 1 power from the losing
    // opponent's faction card to a participating The Seven character you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                !card.hasTrait('The Seven') &&
                ['character', 'location'].includes(card.getType()) &&
                card.controller === context.source.controller,
            effect: ability.effects.cannotGainPower()
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.loser.faction.power >= 1
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven') &&
                    card.isParticipating()
            },
            message: {
                format: "{player} uses {source} and kneels their faction card to move 1 power from {otherPlayer}'s faction to {target}",
                args: { otherPlayer: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.challenge.loser.faction,
                to: context.target,
                amount: 1
            }))
        });
    }
}

TheFaithMilitant.code = '08099';

export default TheFaithMilitant;
