import DrawCard from '../../drawcard.js';

class Spearmaiden extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) =>
                    this.game.isDuringChallenge({ challengeType: 'military' }) &&
                    event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.defendingPlayer &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} chooses {1} as the target for {2}',
                    this.controller,
                    context.target,
                    this
                );

                this.game.once('afterChallenge', (event) =>
                    this.resolveIfWinBy5(event.challenge, context)
                );
            }
        });
    }

    resolveIfWinBy5(challenge, context) {
        if (challenge.winner !== this.controller || challenge.strengthDifference < 5) {
            return;
        }

        this.game.addMessage(
            '{0} uses {1} to force {2} to be chosen for claim, if able',
            this.controller,
            this,
            context.target
        );

        this.untilEndOfChallenge((ability) => ({
            targetController: 'opponent',
            effect: ability.effects.mustChooseAsClaim((card) => card === context.target)
        }));
    }
}

Spearmaiden.code = '04055';

export default Spearmaiden;
