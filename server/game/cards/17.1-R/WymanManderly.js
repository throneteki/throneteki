import DrawCard from '../../drawcard.js';

class WymanManderly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
                this.game.killCharacter(context.target);
            }
        });
        this.reaction({
            when: {
                'onSacrificed:aggregate': (event) =>
                    this.hasCharacterYouControlled(event, 'cardStateWhenSacrificed'),
                'onCharacterKilled:aggregate': (event) =>
                    this.hasCharacterYouControlled(event, 'cardStateWhenKilled')
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                let bonusMessages = [];

                if (this.kneeled) {
                    context.player.standCard(this);
                    bonusMessages.push('stand {1}');
                }

                if (this.controller.canDraw()) {
                    context.player.drawCardsToHand(1).length;
                    bonusMessages.push('draw 1 card');
                }

                this.game.addMessage(
                    '{0} uses {1} to ' + bonusMessages.join(' and '),
                    context.player,
                    this
                );
            }
        });
    }

    hasCharacterYouControlled(event, cardStateKey) {
        return (
            this.canChangeGameState() &&
            event.events.some((subEvent) => {
                let cardState = subEvent[cardStateKey];
                return (
                    cardState.controller === this.controller && cardState.getType() === 'character'
                );
            })
        );
    }

    canChangeGameState() {
        return this.controller.canDraw() || this.kneeled;
    }
}

WymanManderly.code = '17122';

export default WymanManderly;
