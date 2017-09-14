const ApplyClaim = require('../../gamesteps/challenge/applyclaim.js');
const DrawCard = require('../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' && !this.allChallengesDefended()
            },
            chooseOpponent: true,
            handler: context => {
                this.chosenOpponent = context.opponent;

                let buttons = [];
                let challengeTypes = this.challengeTypesDefended();

                if(!challengeTypes.includes('military')) {
                    buttons.push({ text: 'Military', method: 'satisfyClaim', arg: 'military' });
                }
                if(!challengeTypes.includes('intrigue')) {
                    buttons.push({ text: 'Intrigue', method: 'satisfyClaim', arg: 'intrigue' });
                }
                if(!challengeTypes.includes('power')) {
                    buttons.push({ text: 'Power', method: 'satisfyClaim', arg: 'power' });
                }
                buttons.push({ text: 'Done', method: 'cancel' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    satisfyClaim(player, claimType) {
        let challenge = {
            winner: player,
            loser: this.chosenOpponent,
            challengeType: claimType,
            claim: player.getClaim()
        };

        this.game.addMessage('{0} uses {1} to have {2} satisfy {3} claim',
            player, this, this.chosenOpponent, claimType);

        this.game.queueStep(new ApplyClaim(this.game, challenge));

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }

    allChallengesDefended() {
        let challengeTypes = this.challengeTypesDefended();

        return (
            challengeTypes.includes('military') &&
            challengeTypes.includes('intrigue') &&
            challengeTypes.includes('power')
        );
    }

    challengeTypesDefended() {
        let challenges = this.controller.getParticipatedChallenges();
        let challengesDefended = challenges.filter(challenge => challenge.defendingPlayer === this.controller);
        return challengesDefended.map(challenge => challenge.challengeType);
    }
}

MaesterAemon.code = '07005';

module.exports = MaesterAemon;
