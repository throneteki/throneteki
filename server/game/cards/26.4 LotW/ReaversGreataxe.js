import DrawCard from '../../drawcard.js';

class ReaversGreataxe extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: false, faction: 'greyjoy' });
        this.whileAttached({
            effect: ability.effects.addTrait('Raider')
        });
        this.whileAttached({
            condition: () =>
                this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 1 }) &&
                this.hasMoreAttachmentsThanDefender(this.game.currentChallenge.defendingPlayer),
            match: this.parent,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    hasMoreAttachmentsThanDefender(defendingPlayer) {
        return (
            this.controller.getNumberOfCardsInPlay({ type: 'attachment' }) >
            defendingPlayer.getNumberOfCardsInPlay({ type: 'attachment' })
        );
    }
}

ReaversGreataxe.code = '26064';

export default ReaversGreataxe;
