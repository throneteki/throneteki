import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheIronThrone extends DrawCard {
    // The Iron Throne (13117)
    // Reaction: After a phase begins, kneel The Iron Throne to name a card. Until the end of the
    // phase, that card cannot be marshaled, played, or put into play.
    setupCardAbilities(ability) {
        const named = (context) => (card) =>
            card.name.toLowerCase() === context.namedCard.toLowerCase();

        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to name a card',
            gameAction: GameActions.nameCard({
                message: '{player} names {cardName}',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'any',
                    effect: [
                        ability.effects.cannotMarshal(named(context)),
                        ability.effects.cannotPlay(named(context)),
                        ability.effects.cannotPutIntoPlay(named(context))
                    ]
                }))
            })
        });
    }
}

TheIronThrone.code = '13117';

export default TheIronThrone;
