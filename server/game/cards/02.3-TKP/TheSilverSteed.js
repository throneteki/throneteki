import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSilverSteed extends DrawCard {
    // The Silver Steed (02054)
    // Dothraki character or Daenerys Targaryen only.
    // While attached character is participating in a [power] challenge, it gains renown.
    // Reaction: After attached character gains power using renown, sacrifice The Silver Steed.
    // Then, you may initiate an additional [power] challenge this phase.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Dothraki' }, { name: 'Daenerys Targaryen' });
        this.whileAttached({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'power' }) &&
                this.parent.isParticipating(),
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card === this.parent && event.reason === 'renown'
            },
            message: '{player} sacrifices {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.sacrificeCard({ card: this }).then(() => ({
                        message: {
                            format: 'Then {player} is able to initiate an additional power challenge this phase'
                        },
                        handler: () => {
                            this.untilEndOfPhase((ability) => ({
                                targetController: 'current',
                                effect: ability.effects.mayInitiateAdditionalChallenge('power')
                            }));
                        }
                    })),
                    context
                );
            }
        });
    }
}

TheSilverSteed.code = '02054';

export default TheSilverSteed;
