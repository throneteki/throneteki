const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class CitadelNovice extends DrawCard {
    setupCardAbilities(ability) {
        const isAttachmentOrMaester = (card) =>
            card.isMatch({ type: 'attachment' }) ||
            card.isMatch({ type: 'character', trait: 'Maester' });
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => isAttachmentOrMaester(context.event.cards[0]),
                message: '{player} {gameAction}',
                gameAction: GameActions.drawSpecific((context) => ({
                    player: context.player,
                    cards: context.event.revealed
                }))
            })
        });
    }
}

CitadelNovice.code = '09041';

module.exports = CitadelNovice;
