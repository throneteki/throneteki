import DrawCard from '../../drawcard.js';

class SealOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled,
            cost: ability.costs.kneelSelf(),
            message: () =>
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    this.controller,
                    this,
                    this.parent
                ),
            handler: () => {
                this.controller.standCard(this.parent);
            }
        });
    }
}

SealOfTheHand.code = '01032';

export default SealOfTheHand;
