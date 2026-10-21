import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class EnemiesInEveryShadow extends PlotCard {
    // Enemies in Every Shadow (25099)
    // While there are no cards in shadows, each character you control gets +1 STR.
    // Reaction: After you win a challenge, choose a card in shadows controlled by the losing
    // opponent, and discard it. If that card is a character, place it in its owner's dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.allCards.every((card) => card.location !== 'shadows'),
            match: (card) => card.getType() === 'character',
            targetController: 'current',
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: {
                    location: 'shadows',
                    condition: (card, context) =>
                        card.controller === context.event.challenge.loser &&
                        GameActions.discardCard({ card }).allow()
                }
            },
            message: '{player} uses {source} to choose and discard {target}',
            handler: (context) => {
                const event = GameActions.discardCard({ card: context.target }).createEvent();
                if (context.target.getType() === 'character') {
                    event.replaceHandler(() => {
                        this.game.addMessage(
                            '{0} is placed in the dead pile for {1}',
                            context.target,
                            context.source
                        );
                        event.thenAttachEvent(
                            GameActions.placeCard({
                                card: event.card,
                                location: 'dead pile'
                            }).createEvent()
                        );
                    });
                }
                this.game.resolveEvent(event);
            }
        });
    }
}

EnemiesInEveryShadow.code = '25099';

export default EnemiesInEveryShadow;
