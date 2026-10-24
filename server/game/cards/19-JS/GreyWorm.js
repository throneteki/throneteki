import DrawCard from '../../drawcard.js';

class GreyWorm extends DrawCard {
    // Grey Worm (19013)
    // No attachments except Weapon.
    // Grey Worm does not kneel when declared as a defender against an opponent with more cards in
    // their hand than you.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.source.controller.getHandCount() <
                    context.game.currentChallenge.attackingPlayer.getHandCount(),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

GreyWorm.code = '19013';

export default GreyWorm;
