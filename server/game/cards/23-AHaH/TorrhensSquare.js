import DrawCard from '../../drawcard.js';

class TorrhensSquare extends DrawCard {
    // Torrhen's Square (23004)
    // Reaction: After a [greyjoy] card you control comes out of shadows, kneel Torrhen's Square to
    // choose up to 3 Raider characters with printed cost higher than your initiative value. Until
    // the end of the phase, each of those characters discards an additional card using pillage.
    // -2 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('greyjoy')
            },
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters',
                cardCondition: {
                    type: 'character',
                    trait: 'Raider',
                    location: 'play area',
                    condition: (card, context) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() > context.player.getInitiative()
                }
            },
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to have {target} discard an additional card from pillage until the end of the phase',
            handler: (context) => {
                for (let card of context.target) {
                    card.untilEndOfPhase((ability) => ({
                        match: card,
                        effect: ability.effects.modifyKeywordTriggerAmount('pillage', 1)
                    }));
                }
            }
        });
    }
}

TorrhensSquare.code = '23004';

export default TorrhensSquare;
