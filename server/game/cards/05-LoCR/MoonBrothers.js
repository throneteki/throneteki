import DrawCard from '../../drawcard.js';

class MoonBrothers extends DrawCard {
    // Moon Brothers (05011)
    // Action: During a challenge in which you control an attacking Clansman character, kneel your
    // faction card to put Moon Brothers into play from your hand (standing), participating as an
    // attacker.
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as an attacker',
            location: 'hand',
            condition: () => this.hasAttackingClansman() && this.controller.canPutIntoPlay(this),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.controller.putIntoPlay(this);
                this.game.currentChallenge.addAttacker(this);
                this.game.addMessage(
                    '{0} kneels their faction card to put {1} into play participating as an attacker',
                    this.controller,
                    this
                );
            }
        });
    }

    hasAttackingClansman() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.hasTrait('Clansman') && card.getType() === 'character' && card.isAttacking()
            );
        });

        return cards.length > 0;
    }
}

MoonBrothers.code = '05011';

export default MoonBrothers;
