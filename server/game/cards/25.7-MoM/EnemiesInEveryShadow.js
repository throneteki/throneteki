const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard');

class EnemiesInEveryShadow extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.allCards.every(card => card.location !== 'shadows'),
            match: card => card.getType() === 'character',
            targetController: 'current',
            effect: ability.effects.modifyStrength(1)
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: { location: 'shadows', condition: (card, context) => card.controller === context.event.challenge.loser && GameActions.discardCard({ card }).allow() }
            },
            message: '{player} uses {source} to choose and discard {target}',
            handler: context => {
                const event = GameActions.discardCard({ card: context.target }).createEvent();
                if(context.target.getType() === 'character') {
                    event.replaceHandler(() => {
                        this.game.addMessage('{0} is placed in the dead pile for {1}', context.target, context.source);
                        event.thenAttachEvent(
                            GameActions.placeCard({ card: event.card, location: 'dead pile' }).createEvent()
                        );
                    });
                }
                this.game.resolveEvent(event);
            }
        });
    }
}

EnemiesInEveryShadow.code = '25615';
EnemiesInEveryShadow.version = '1.2';

module.exports = EnemiesInEveryShadow;
