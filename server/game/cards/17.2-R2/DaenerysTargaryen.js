import DrawCard from '../../drawcard.js';

class DaenerysTargaryen extends DrawCard {
    // Daenerys Targaryen (17171)
    // Daenerys Targaryen's STR cannot be reduced by card effects.
    // Reaction: After you play a [targaryen] event, choose a participating character. Until the end
    // of the phase, that character gets -1 STR and is killed if its STR is 0. (Limit 3 times per
    // round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotDecreaseStrength(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('targaryen')
            },
            limit: ability.limit.perRound(3),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-1)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} -1 STR until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

DaenerysTargaryen.code = '17171';

export default DaenerysTargaryen;
