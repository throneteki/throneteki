import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordTywinsHost extends DrawCard {
    // Lord Tywin's Host (21007)
    // Assault. No attachments. Pillage.
    // While you control Tywin Lannister, he gains a [military] icon.
    // Reaction: After a [lannister] character you control discards a card using pillage, the losing
    // opponent must choose and discard a card with the same cardtype from their hand unless they
    // reveal a hand containing no cards with that cardtype. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Tywin Lannister',
            effect: ability.effects.addIcon('military')
        });
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source.controller === context.player &&
                    event.source.isFaction('lannister')
            },
            message: {
                format: '{player} uses {source} to have the opponent discard a {type} card from hand, or reveal their hand',
                args: { type: (context) => context.event.card.getType() }
            },
            limit: ability.limit.perRound(3),
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.game.currentChallenge.loser.hand.some(
                        (card) => card.getType() === context.event.card.getType()
                    ),
                thenAction: GameActions.chooseCards({
                    player: (context) => context.game.currentChallenge.loser,
                    title: (context) => `Select a ${context.event.card.getType()}`,
                    cardCondition: (card, context) =>
                        card.location === 'hand' &&
                        card.controller === context.choosingPlayer &&
                        card.getType() === context.event.card.getType(),
                    gameAction: (card) => GameActions.discardCard({ card })
                }),
                elseAction: GameActions.revealCards((context) => ({
                    player: context.game.currentChallenge.loser,
                    cards: context.game.currentChallenge.loser.hand
                }))
            })
        });
    }
}

LordTywinsHost.code = '21007';

export default LordTywinsHost;
