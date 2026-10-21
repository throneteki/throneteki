import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlayneStone extends DrawCard {
    // Alayne Stone (23020)
    // Stealth.
    // If you control Sansa Stark, place Alayne Stone on her as a duplicate.
    // While Alayne Stone is kneeling, players cannot trigger abilities on in-faction Lord or Lady
    // characters during the challenges phase.
    setupCardAbilities(ability) {
        this.stateCheck({
            condition: (context) => !!getSansa(context),
            message: {
                format: '{player} places {source} on {sansa} as a duplicate',
                args: { sansa: (context) => getSansa(context) }
            },
            gameAction: GameActions.placeAsDuplicate((context) => ({
                card: context.source,
                parent: getSansa(context)
            }))
        });

        this.persistentEffect({
            targetController: 'any',
            condition: (context) =>
                context.source.kneeled && context.game.currentPhase === 'challenge',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) =>
                    ability.card.isMatch({ type: 'character', trait: ['Lord', 'Lady'] }) &&
                    ability.card.isFaction(ability.card.controller.faction.getPrintedFaction())
            )
        });
    }
}

function getSansa(context) {
    return context.player.cardsInPlay.find(
        (card) => card.name === 'Sansa Stark' && card.getType() === 'character'
    );
}

AlayneStone.code = '23020';

export default AlayneStone;
