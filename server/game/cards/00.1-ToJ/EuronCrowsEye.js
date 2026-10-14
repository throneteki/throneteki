import DrawCard from '../../drawcard.js';

class EuronCrowsEye extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source.controller === context.player &&
                    event.card.getType() !== 'character' &&
                    event.source.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(2),
            handler: (context) => {
                let character = context.event.source;
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    character
                );
                character.modifyPower(1);
            }
        });
    }
}

EuronCrowsEye.code = '00125';

export default EuronCrowsEye;
