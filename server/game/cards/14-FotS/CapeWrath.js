import DrawCard from '../../drawcard.js';

class CapeWrath extends DrawCard {
    // Cape Wrath (14018)
    // During [power] challenges in which you are the attacking or defending player, raise the claim
    // value on the attacking player's revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: 'power',
                    attackingPlayer: context.source.controller
                }) ||
                context.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: context.source.controller
                }),
            match: (card, context) =>
                card === context.game.currentChallenge.attackingPlayer.activePlot,
            targetController: 'any',
            effect: ability.effects.modifyClaim(1)
        });
    }
}

CapeWrath.code = '14018';

export default CapeWrath;
