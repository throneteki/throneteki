import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheShadowTower extends DrawCard {
    // The Shadow Tower (24014)
    // Each character you control that is owned by an opponent gets +1 STR.
    // Challenges Action: Kneel The Shadow Tower to choose and reveal a card from an opponent's
    // shadows area. If it is a non-unique character, put it into play under your control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.owner !== this.controller,
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Reveal card in shadows',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'shadows' && card.controller !== this.controller,
                gameAction: 'reveal'
            },
            message: '{source} kneels {costs.kneel} to reveal a card in shadows',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        cards: [context.target],
                        player: context.player
                    })).then({
                        condition: (context) =>
                            context.event.cards[0].isMatch({ type: 'character', unique: false }) &&
                            context.parentContext.revealed.length > 0,
                        message: '{player} {gameAction}',
                        gameAction: GameActions.putIntoPlay((context) => ({
                            card: context.event.cards[0],
                            player: context.player
                        }))
                    }),
                    context
                );
            }
        });
    }
}

TheShadowTower.code = '24014';

export default TheShadowTower;
