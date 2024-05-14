const DrawCard = require('../../drawcard');

class ChoosingTheSpear extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                onDeclaredAsAttacker: (event) =>
                    event.card.controller === this.controller &&
                    event.card.isFaction('martell') &&
                    event.challenge.challengeType === 'military' &&
                    event.card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
                this.game.addMessage(
                    '{0} plays {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller,
                    this
                );
                this.game.once('afterChallenge', () =>
                    this.afterChallenge(this.game.currentChallenge, context)
                );
            }
        });
    }

    afterChallenge(challenge, context) {
        if (challenge.loser === context.player) {
            this.game.promptForSelect(context.player, {
                source: this,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character',
                gameAction: 'kill',
                onSelect: (p, card) => this.handleCardSelected(p, card),
                onCancel: (player) => this.handleCancelled(player)
            });
        }
    }

    handleCardSelected(player, card) {
        card.owner.killCharacter(card);
        this.game.addMessage('{0} forces {1} to kill {2}', this, player, card);
        return true;
    }

    handleCancelled(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

ChoosingTheSpear.code = '15032';

module.exports = ChoosingTheSpear;
