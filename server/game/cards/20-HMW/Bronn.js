import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Bronn extends DrawCard {
    // Bronn (20012)
    // Bestow (3). No attachments except Weapon.
    // Bronn gets +2 STR for each gold he has.
    // Interrupt: When a Lord or Lady character would be killed, discard each gold (cannot be 0)
    // from Bronn to save it. Then, if that character was Tyrion Lannister, you may return Bronn to
    // your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicStrength((card) => (card.tokens[Tokens.gold] || 0) * 2)
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    (event.card.hasTrait('Lord') || event.card.hasTrait('Lady')) &&
                    event.card.canBeSaved() &&
                    context.source.tokens[Tokens.gold] > 0
            },
            cost: ability.costs.discardGold((card) => card.tokens[Tokens.gold]),
            message: {
                format: '{player} discards each gold from {source} to save {character}',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event })).then({
                gameAction: GameActions.ifCondition({
                    condition: (context) =>
                        context.parentContext.event.card.name === 'Tyrion Lannister',
                    thenAction: GameActions.may({
                        title: (context) => `Return ${context.source.name} to hand?`,
                        message: '{player} then returns {source} to hand',
                        gameAction: GameActions.returnCardToHand((context) => ({
                            card: context.source
                        }))
                    })
                })
            })
        });
    }
}

Bronn.code = '20012';

export default Bronn;
