import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (11071)
    // Challenges Action: Kneel a Warship location to (choose 1):
    // - choose and kneel a location.
    // - stand Victarion Greyjoy.
    // - have Victarion Greyjoy gain renown until the end of the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a warship location',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('warship')
            ),
            gameAction: GameActions.choose({
                title: 'Choose one',
                choices: {
                    'Kneel a location': {
                        message:
                            '{player} uses {source} and kneels {costs.kneel} to kneel a location',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a location',
                            cardCondition: (card) =>
                                card.location === 'play area' && card.getType() === 'location',
                            gameAction: (card) => GameActions.kneelCard({ card })
                        })
                    },
                    'Stand Victarion': {
                        message: '{player} uses {source} to kneel {costs.kneel} and stand {source}',
                        gameAction: GameActions.standCard((context) => ({ card: context.source }))
                    },
                    'Gain renown': {
                        message:
                            '{player} uses {source} to kneel {costs.kneel} and have {source} gain renown',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfChallenge',
                            match: context.source,
                            effect: ability.effects.addKeyword('renown')
                        }))
                    }
                }
            })
        });
    }
}

VictarionGreyjoy.code = '11071';

export default VictarionGreyjoy;
