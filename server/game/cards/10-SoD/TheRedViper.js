import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRedViper extends DrawCard {
    // The Red Viper (10003)
    // Intimidate.
    // The Red Viper gets +1 STR for each power he has.
    // Reaction: After you win a challenge in which you control an attacking Bastard character, The
    // Red Viper gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => context.source.power)
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.hasAttackingBastard() &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }

    hasAttackingBastard() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('Bastard')
        );
    }
}

TheRedViper.code = '10003';

export default TheRedViper;
