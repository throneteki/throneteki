import DrawCard from '../../drawcard.js';

class FireyTalons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give character -1 STR',
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            message: '{player} plays {source} to give {target} -1 STR until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.putInShadowsByStrength(-1)
                }));
            }
        });
    }
}

FireyTalons.code = '27511';
FireyTalons.version = '1.0.0';

export default FireyTalons;
