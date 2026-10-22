import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JoffreyBaratheon extends DrawCard {
    // Joffrey Baratheon (01086)
    // Reaction: After a Lord or Lady character is killed, Joffrey Baratheon gains 1 power. (Limit 3
    // times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.getType() === 'character' &&
                    (event.cardStateWhenKilled.hasTrait('Lord') ||
                        event.cardStateWhenKilled.hasTrait('Lady')) &&
                    context.source.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(3),
            message: '{player} gains 1 power from a Lord or Lady being killed',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

JoffreyBaratheon.code = '01086';

export default JoffreyBaratheon;
