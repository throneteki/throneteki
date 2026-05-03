import DrawCard from '../../drawcard.js';

class QuentynMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play',
            condition: () => {
                this.strengthAtInitiation = this.getStrength();
                return this.strengthAtInitiation > 0;
            },
            target: {
                cardType: 'character',
                location: ['hand', 'discard pile'],
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.getPrintedStrength() < this.strengthAtInitiation &&
                    context.player.canPutIntoPlay(card)
            },
            max: ability.limit.perRound(1),
            cost: ability.costs.putSelfIntoShadows(),
            handler: (context) => {
                let targetCharacter = context.target;
                let origin = targetCharacter.location;
                context.player.putIntoPlay(targetCharacter);
                this.atEndOfPhase((ability) => ({
                    match: targetCharacter,
                    condition: () => ['play area', 'duplicate'].includes(targetCharacter.location),
                    targetLocation: 'any',
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));

                this.game.addMessage(
                    '{0} returns {1} to shadows to put {2} into play from their {3}',
                    context.player,
                    this,
                    targetCharacter,
                    origin
                );
            }
        });
    }
}

QuentynMartell.code = '00250';

export default QuentynMartell;
