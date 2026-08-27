import DrawCard from '../../drawcard.js';

class CaptainOfTheIronFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: ability.effects.addTrait('Captain')
        });
        this.action({
            title: 'Contribute STR to challenge',
            condition: () =>
                !!this.parent &&
                this.game.isDuringChallenge({ challengeType: ['military', 'power'] }),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneel({ type: 'location', trait: 'Warship' })
            ],
            message: {
                format: "{player} kneels {source} and {costs.kneel} to have {parent} contribute its STR to {player}'s side of the challenge",
                args: { parent: () => this.parent }
            },
            handler: () => {
                const parent = this.parent;
                this.untilEndOfChallenge((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.contributeCharacterStrength(parent)
                }));
            }
        });
    }
}

CaptainOfTheIronFleet.code = '27004';

export default CaptainOfTheIronFleet;
