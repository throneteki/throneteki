const DrawCard = require('../../drawcard.js');
const ChallengeTypes = require('../../ChallengeTypes');

class MaesterMullin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to choose a character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.selectedCharacter = context.target;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: ChallengeTypes.asButtons({ method: 'selectChallengeType' })
                    },
                    source: this
                });
            }
        });
    }

    selectChallengeType(player, challengeType) {
        this.untilEndOfPhase((ability) => ({
            condition: () => this.game.isDuringChallenge({ challengeType }),
            match: this.selectedCharacter,
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        }));

        this.game.addMessage(
            '{0} uses {1} to make {2} unable to be declared as an attacker in {3} challenges this phase',
            player,
            this,
            this.selectedCharacter,
            challengeType
        );

        this.selectedCharacter = null;

        return true;
    }
}

MaesterMullin.code = '13045';

module.exports = MaesterMullin;
