import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import GameActions from '../../GameActions/index.js';

class GreyGhost extends DrawCard {
    // Grey Ghost (11072)
    // Shadow (2).
    // Action: Kneel Grey Ghost to choose 1 character (up to 2 characters instead if Grey Ghost came
    // out of shadows this phase). Until the end of the phase, each chosen character cannot be
    // declared as a defender.
    setupCardAbilities(ability) {
        const tracker = CardEntersPlayTracker.forPhase(this.game);
        const numCards = (context) => (tracker.hasComeOutOfShadows(context.source) ? 2 : 1);

        this.action({
            title: 'Prevent character(s) from defending',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to make characters unable to be declared as defenders',
            gameAction: GameActions.chooseCards({
                mode: 'upTo',
                numCards,
                title: (context) =>
                    numCards(context) === 2 ? 'Select up to 2 characters' : 'Select a character',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character',
                gameAction: (card) =>
                    GameActions.lastingEffect(() => ({
                        duration: 'untilEndOfPhase',
                        match: card,
                        effect: ability.effects.cannotBeDeclaredAsDefender()
                    }))
            })
        });
    }
}

GreyGhost.code = '11072';

export default GreyGhost;
