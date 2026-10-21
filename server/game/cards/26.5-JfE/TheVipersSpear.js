import DrawCard from '../../drawcard.js';

class TheVipersSpear extends DrawCard {
    // The Viper's Spear (26088)
    // Sand Snake character or The Red Viper only.
    // During [military] challenges, attached character gets +3 STR and does not kneel when declared
    // as an attacker against an opponent who controls more characters than you.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Sand Snake' }, { name: 'The Red Viper' });
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            match: this.parent,
            effect: ability.effects.modifyStrength(3)
        });
        this.whileAttached({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.hasFewerCharactersThanDefender(this.game.currentChallenge.defendingPlayer),
            match: this.parent,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    hasFewerCharactersThanDefender(defendingPlayer) {
        return (
            this.controller.getNumberOfCardsInPlay({ type: 'character' }) <
            defendingPlayer.getNumberOfCardsInPlay({ type: 'character' })
        );
    }
}

TheVipersSpear.code = '26088';

export default TheVipersSpear;
