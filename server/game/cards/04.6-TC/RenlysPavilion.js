import DrawCard from '../../drawcard.js';

class RenlysPavilion extends DrawCard {
    // Renly's Pavilion (04104)
    // Action: Kneel Renly's Pavilion to choose 2 characters. Until the end of the phase, one of
    // those characters gets -1 STR, and the other gets +1 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Modify strength of 2 characters',
            cost: ability.costs.kneelSelf(),
            targets: {
                toLower: {
                    activePromptTitle: 'Select a character to get -1 STR',
                    cardCondition: (card) => this.cardCondition(card),
                    gameAction: 'decreaseStrength'
                },
                toRaise: {
                    activePromptTitle: 'Select a character to get +1 STR',
                    cardCondition: (card) => this.cardCondition(card)
                }
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to give -1 STR to {2} and +1 STR to {3}',
                    context.player,
                    this,
                    context.targets.toLower,
                    context.targets.toRaise
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.targets.toLower,
                    effect: ability.effects.modifyStrength(-1)
                }));
                this.untilEndOfPhase((ability) => ({
                    match: context.targets.toRaise,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }
}

RenlysPavilion.code = '04104';

export default RenlysPavilion;
