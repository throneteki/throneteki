import DrawCard from '../../drawcard.js';

class CaptainOfTheIronFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: ability.effects.addTrait('captain')
        });
        this.action({
            title: 'Participate in challenge',
            condition: () => this.game.isDuringChallenge({ challengeType: ['military', 'power'] }),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneel({ type: 'location', trait: 'warship' })
            ],
            message: {
                format: '{player} kneels {costs.kneel} to add {parent} to the challenge',
                args: { parent: () => this.parent }
            },
            handler: (context) => {
                // TODO: Make this a game action!
                this.game.currentChallenge.addParticipantToSide(context.player, this.parent);
            }
        });
    }
}

CaptainOfTheIronFleet.code = '27519';
CaptainOfTheIronFleet.version = '1.0.0';

export default CaptainOfTheIronFleet;
