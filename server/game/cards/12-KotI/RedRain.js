import DrawCard from '../../drawcard.js';

class RedRain extends DrawCard {
    // Red Rain (12021)
    // Unique [greyjoy] character only.
    // If attached character is The Drumm, he gains stealth.
    // Reaction: After you win an unopposed challenge in which attached character is attacking, it
    // gains 2 power. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy', unique: true });

        this.whileAttached({
            match: (card) => card.name === 'The Drumm',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true }) &&
                    this.parent.isAttacking() &&
                    this.parent.canGainPower()
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 2 power',
                    context.player,
                    this,
                    this.parent
                );
                this.parent.modifyPower(2);
            }
        });
    }
}

RedRain.code = '12021';

export default RedRain;
