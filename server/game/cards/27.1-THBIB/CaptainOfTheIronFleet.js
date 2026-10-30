import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CaptainOfTheIronFleet extends DrawCard {
    // Captain of the Iron Fleet (27004)
    // Ironborn character you control only.
    // Attached character gains the Captain trait.
    // Action: During a [military] or [power] challenge, kneel Captain of the Iron Fleet and a
    // Warship location to have attached character contribute its STR to your side this challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: ability.effects.addTrait('Captain')
        });
        this.action({
            title: 'Contribute STR to challenge',
            condition: (context) =>
                !!context.source.parent &&
                context.game.isDuringChallenge({ challengeType: ['military', 'power'] }),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.kneel({ type: 'location', trait: 'Warship' })
            ],
            message: {
                format: "{player} kneels {source} and {costs.kneel} to have {parent} contribute its STR to {player}'s side of the challenge",
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                targetController: 'current',
                effect: ability.effects.contributeCharacterStrength(context.source.parent)
            }))
        });
    }
}

CaptainOfTheIronFleet.code = '27004';

export default CaptainOfTheIronFleet;
