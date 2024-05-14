import DrawCard from '../../drawcard.js';

class UnexpectedGuile extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current', shadow: true });
        this.whileAttached({
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Insight')]
        });

        this.forcedInterrupt({
            when: {
                onChallengeFinished: (event) => event.challenge.isParticipating(this.parent)
            },
            handler: (context) => {
                context.player.putIntoShadows(this.parent, true);
                context.player.putIntoShadows(this);

                this.game.addMessage(
                    '{0} is forced to return {1} and {2} to shadows',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

UnexpectedGuile.code = '13044';

export default UnexpectedGuile;
