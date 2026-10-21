import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WinterfellCrypt extends DrawCard {
    // Winterfell Crypt (02082)
    // Reaction: After a unique [stark] character you control is killed or sacrificed during the
    // challenges phase, sacrifice Winterfell Crypt to choose a character with equal or lower
    // printed STR. At the end of the phase, if that character is still in play, shuffle it back
    // into its owner's deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    context.source.triggerCondition(event.cardStateWhenSacrificed),
                onCharacterKilled: (event, context) =>
                    context.source.triggerCondition(event.cardStateWhenKilled)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedStrength() <= context.event.card.getPrintedStrength()
            },
            message: '{player} sacrifices {source} to choose {target}',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'atEndOfPhase',
                match: context.target,
                condition: () => ['play area', 'duplicate'].includes(context.target.location),
                effect: ability.effects.shuffleIntoDeckIfStillInPlay()
            }))
        });
    }

    triggerCondition(card) {
        return (
            card.controller === this.controller &&
            card.isUnique() &&
            card.isFaction('stark') &&
            card.getType() === 'character' &&
            this.game.currentPhase === 'challenge'
        );
    }
}

WinterfellCrypt.code = '02082';

export default WinterfellCrypt;
