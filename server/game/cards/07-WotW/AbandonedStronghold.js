import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AbandonedStronghold extends DrawCard {
    // Abandoned Stronghold (07018)
    // Action: Kneel Abandoned Stronghold to choose a defending character. Until the end of the
    // challenge, that character gets +X STR. X is the number of Builder characters you control.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending()
            },
            message: {
                format: '{player} kneels {source} to give {target} +{strBoost} STR until the end of the challenge',
                args: { strBoost: (context) => context.source.getNumberOfBuilders() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(context.source.getNumberOfBuilders())
            }))
        });
    }

    getNumberOfBuilders() {
        return this.controller.getNumberOfCardsInPlay(
            (card) =>
                card.controller === this.controller &&
                card.hasTrait('Builder') &&
                card.getType() === 'character'
        );
    }
}

AbandonedStronghold.code = '07018';

export default AbandonedStronghold;
