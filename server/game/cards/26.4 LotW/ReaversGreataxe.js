import DrawCard from '../../drawcard.js';

class ReaversGreataxe extends DrawCard {
    // Reaver's Greataxe (26064)
    // Non-unique [greyjoy] character only.
    // Attached character gains the Raider trait.
    // During the first challenge you initiate each phase, attached character does not kneel when
    // declared as an attacker against an opponent who controls fewer attachments than you.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: false, faction: 'greyjoy' });
        this.whileAttached({
            effect: ability.effects.addTrait('Raider')
        });
        this.whileAttached({
            condition: (context) =>
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    number: 1
                }) &&
                context.source.hasMoreAttachmentsThanDefender(
                    context.game.currentChallenge.defendingPlayer
                ),
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
