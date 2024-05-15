import DrawCard from '../../drawcard.js';

class AnyaWaynwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Harry the Heir' && card.controller === this.controller,
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Contribute STR to challenge',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.isFaction('neutral')
            ),
            condition: () => this.game.isDuringChallenge(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: false,
                    condition: (card, context) =>
                        !context.costs.kneel ||
                        card.getPrintedCost() <= context.costs.kneel.getPrintedCost()
                }
            },
            message: {
                format: "{player} uses {source} and kneels {costs.kneel} to have {target} contribute its STR (currently {str}) to {player}'s side of the challenge",
                args: { str: (context) => context.target.getStrength() }
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.contributeCharacterStrength(context.target)
                }));
            }
        });
    }
}

AnyaWaynwood.code = '23018';

export default AnyaWaynwood;
