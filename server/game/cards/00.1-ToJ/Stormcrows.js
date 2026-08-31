import DrawCard from '../../drawcard.js';

class Stormcrows extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.canMarshalIntoShadows(
                (card) => card === this && card.location === 'discard pile'
            )
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.attachments.length === 0 &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-1)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} -1 STR until the end of the challenge and kill it if its STR is 0',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Stormcrows.code = '00266';

export default Stormcrows;
