import DrawCard from '../../drawcard.js';

class TheVipersSpear extends DrawCard {
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
