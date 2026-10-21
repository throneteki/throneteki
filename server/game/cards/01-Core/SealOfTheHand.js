import DrawCard from '../../drawcard.js';

class SealOfTheHand extends DrawCard {
    // Seal of the Hand (01032)
    // Lord or Lady character only.
    // Action: Kneel Seal of the Hand to stand attached character.
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
