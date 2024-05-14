import DrawCard from '../../drawcard.js';

class Gendry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.isLoyal() &&
                    card.attachments.some((attachment) => attachment.hasTrait('Weapon'))
            },
            handler: (context) => {
                let keywords = this.getKeywords();
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(2),
                        ...keywords.map((keyword) => ability.effects.addKeyword(keyword))
                    ]
                }));
                this.game.addMessage(
                    "{0} uses {1} to have {2} gain +2 STR and each of {1}'s keywords: {3}",
                    context.player,
                    this,
                    context.target,
                    keywords
                );
            }
        });
    }
}

Gendry.code = '22001';

export default Gendry;
