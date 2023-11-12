const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.isMatch({ challengeType: 'military' })
            },
            message: '{player} uses {source} to have either standing or kneeling characters satisfied for claim',
            choices: {
                'Standing Characters': {
                    message: '{player} chooses to have standing characters satisfied for claim',
                    gameAction: this.mustChooseClaimGameAction(card => !card.kneeled)
                },
                'Kneeling Characters': {
                    message: '{player} chooses to have kneeling characters satisfied for claim',
                    gameAction: this.mustChooseClaimGameAction(card => card.kneeled)
                }
            }
        });
    }

    mustChooseClaimGameAction(cardFunc) {
        return GameActions.genericHandler(() => {
            this.untilEndOfChallenge(ability => ({
                targetController: 'any',
                effect: ability.effects.mustChooseAsClaim(cardFunc)
            }));
        });
    }
}

JonSnow.code = '25563';
JonSnow.version = '1.2';

module.exports = JonSnow;
