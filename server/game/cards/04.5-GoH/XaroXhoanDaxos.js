import DrawCard from '../../drawcard.js';

class XaroXhoanDaxos extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'attachment' &&
                    event.card.isUnique() &&
                    event.playingType === 'marshal' &&
                    event.card.controller === this.controller &&
                    this.controller.canGainGold()
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }
}

XaroXhoanDaxos.code = '04093';

export default XaroXhoanDaxos;
