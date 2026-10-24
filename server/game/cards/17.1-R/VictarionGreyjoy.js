import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (17102)
    // Challenges Action: Kneel a Warship location to stand Victarion Greyjoy. (Limit twice per
    // phase.)
    // Challenges Action: Kneel a Warship location to either: choose and kneel a location, or have
    // Victarion Greyjoy gain renown until the end of the challenge.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Victarion',
            phase: 'challenge',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('warship')
            ),
            message: '{player} uses {source} to kneel {costs.kneel} and stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
        this.action({
            title: 'Kneel location or gain renown',
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

VictarionGreyjoy.code = '17102';

export default VictarionGreyjoy;
