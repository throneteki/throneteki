import DrawCard from '../../drawcard.js';

class MaesterOfStarfall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove a keyword',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                let keywords = ['Insight', 'Intimidate', 'Pillage', 'Renown'];

                this.selectedCard = context.target;

                let buttons = keywords.map((keyword) => {
                    return { text: keyword, method: 'keywordSelected', arg: keyword.toLowerCase() };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a keyword',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    keywordSelected(player, keyword) {
        this.untilEndOfPhase((ability) => ({
            match: this.selectedCard,
            effect: ability.effects.removeKeyword(keyword)
        }));

        this.game.addMessage(
            '{0} kneels {1} to remove the {2} keyword from {3}',
            player,
            this,
            keyword,
            this.selectedCard
        );

        return true;
    }
}

MaesterOfStarfall.code = '02076';

export default MaesterOfStarfall;
