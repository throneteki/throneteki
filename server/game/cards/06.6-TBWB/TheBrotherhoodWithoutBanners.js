import AgendaCard from '../../agendacard.js';

class TheBrotherhoodWithoutBanners extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('neutral')
            },
            handler: (context) => {
                this.target = context.target;
                let buttons = [];
                let keywords = ['Insight', 'Intimidate', 'Renown', 'Stealth'];

                keywords.map((keyword) => {
                    buttons.push({
                        text: keyword,
                        method: 'keywordSelected',
                        arg: keyword.toLowerCase()
                    });
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
            match: this.target,
            effect: ability.effects.addKeyword(keyword)
        }));

        this.game.addMessage(
            '{0} uses {1} and kneels their faction card to have {2} gain {3} until the end of the phase',
            this.controller,
            this,
            this.target,
            keyword
        );

        return true;
    }
}

TheBrotherhoodWithoutBanners.code = '06119';

export default TheBrotherhoodWithoutBanners;
