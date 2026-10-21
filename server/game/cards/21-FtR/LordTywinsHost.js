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
                thenAction: GameActions.genericHandler((context) => {
                    this.game.promptForSelect(this.game.currentChallenge.loser, {
                        source: this,
                        activePromptTitle: `Select a ${context.event.card.getType()}`,
                        cardCondition: (card) =>
                            card.location === 'hand' &&
                            card.controller === this.game.currentChallenge.loser &&
                            card.getType() === context.event.card.getType(),
                        onSelect: (player, card) => this.onCardSelected(context, player, card),
                        onCancel: (player) => this.onCancel(player)
                    });
                }),
                elseAction: GameActions.revealCards(() => ({
                    player: this.game.currentChallenge.loser,
                    cards: this.game.currentChallenge.loser.hand
                }))
            })
        });
    }

    onCardSelected(context, player, card) {
        this.game.addMessage(
            '{0} discards {1} from their hand',
            this.game.currentChallenge.loser,
            card
        );
        context.game.resolveGameAction(GameActions.discardCard({ card }), context);

        return true;
    }

    onCancel(player) {
        this.game.addAlert('danger', '{0} did not select a card to discard for {1}', player, this);

        return true;
    }
}

LordTywinsHost.code = '21007';

export default LordTywinsHost;
