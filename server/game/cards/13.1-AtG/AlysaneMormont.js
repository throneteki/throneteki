const DrawCard = require('../../drawcard.js');

class AlysaneMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.allCharactersHaveStarkAffiliation() && this.game.isDuringChallenge({ challengeType: 'military'}),
            match: this,
            effect: [
                ability.effects.addKeyword('stealth'),
                ability.effects.doesNotKneelAsAttacker()
            ]
        });
    }

    allCharactersHaveStarkAffiliation() {
        return (this.controller.getNumberOfCardsInPlay(card => card.getType() === 'character')
            === this.controller.getNumberOfCardsInPlay(card => card.getType() === 'character' && card.isFaction('stark')));
    }
}

AlysaneMormont.code = '13001';

module.exports = AlysaneMormont;
