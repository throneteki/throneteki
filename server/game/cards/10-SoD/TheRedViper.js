import DrawCard from '../../drawcard.js';

class TheRedViper extends DrawCard {
    // The Red Viper (10003)
    // Intimidate.
    // The Red Viper gets +1 STR for each power he has.
    // Reaction: After you win a challenge in which you control an attacking Bastard character, The
    // Red Viper gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.hasAttackingBastard() &&
                    this.allowGameAction('gainPower')
            },
            handler: (context) => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', context.player, this);
            }
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
