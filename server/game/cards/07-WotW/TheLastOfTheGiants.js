import DrawCard from '../../drawcard.js';

class TheLastOfTheGiants extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put character into play',
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('neutral') &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('Intimidate')
                }));

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => 'play area' === context.target.location,
                    effect: ability.effects.killIfStillInPlay(false)
                }));

                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

TheLastOfTheGiants.code = '07045';

export default TheLastOfTheGiants;
