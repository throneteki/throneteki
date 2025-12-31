import DrawCard from '../../drawcard.js';

class SerAlliserThorne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.isFaction('thenightswatch')
            },
            message: '{player} uses {source} to give {target} stealth until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('stealth')
                }));
            },
            limit: ability.limit.perRound(2)
        });
    }
}

SerAlliserThorne.code = '27549';
SerAlliserThorne.version = '1.0.0';

export default SerAlliserThorne;
