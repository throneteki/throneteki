import DrawCard from '../../drawcard.js';

class SansaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'any',
            match: this,
            effect: ability.effects.entersPlayKneeled()
        });
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this && this.controller.canGainFactionPower()
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.addPower(this.controller, 1);

                this.game.addMessage(
                    '{0} uses {1} to gain 1 power for their faction',
                    this.controller,
                    this
                );
            }
        });
    }
}

SansaStark.code = '01147';

export default SansaStark;
