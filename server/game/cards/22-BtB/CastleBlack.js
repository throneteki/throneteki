import DrawCard from '../../drawcard.js';

class CastleBlack extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (card.name === 'Castle Black' ||
                        (card.isFaction('thenightswatch') && card.getType() === 'character')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                context.player.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    event.source.controller !== this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} kneels {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
        });
    }
}

CastleBlack.code = '22014';

export default CastleBlack;
