import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerRichardHorpe extends DrawCard {
    // Ser Richard Horpe (20001)
    // Renown.
    // Ser Richard Horpe gets +1 STR for each power he has.
    // Action: Move 1 power from a card you control to another card in play. (Limit once per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => context.source.power)
        });

        this.action({
            title: 'Move 1 power',
            limit: ability.limit.perRound(1),
            targets: {
                from: {
                    activePromptTitle: 'Select card with power',
                    cardCondition: (card, context) =>
                        ['active plot', 'faction', 'play area'].includes(card.location) &&
                        card.power > 0 &&
                        card.controller === context.player,
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                },
                to: {
                    activePromptTitle: 'Select card to move power',
                    cardCondition: (card, context) =>
                        ['active plot', 'faction', 'play area'].includes(card.location) &&
                        (!context.targets.from || card !== context.targets.from),
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                }
            },
            message: {
                format: '{player} uses {source} to move 1 power from {from} to {to}',
                args: {
                    from: (context) => context.targets.from,
                    to: (context) => context.targets.to
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.targets.from,
                to: context.targets.to,
                amount: 1
            }))
        });
    }
}

SerRichardHorpe.code = '20001';

export default SerRichardHorpe;
