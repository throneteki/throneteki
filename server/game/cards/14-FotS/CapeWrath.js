import DrawCard from '../../drawcard.js';

class CapeWrath extends DrawCard {
    // Cape Wrath (14018)
    // During [power] challenges in which you are the attacking or defending player, raise the claim
    // value on the attacking player's revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: 'power',
                    attackingPlayer: this.controller
                }) ||
                this.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: this.controller
                }),
            match: (card) => card === this.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(1)
        });
    }
}

CapeWrath.code = '14018';

export default CapeWrath;
