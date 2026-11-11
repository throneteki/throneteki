import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheBrotherhoodWithoutBanners extends AgendaCard {
    // The Brotherhood Without Banners (06119)
    // You cannot include loyal characters in your deck.
    // Reaction: After the challenges phase begins, kneel your faction card to choose a neutral
    // character you control. Until the end of the phase, that character gains (choose one):
    // insight, intimidate, renown, or stealth.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.isFaction('neutral')
            },
            gameAction: GameActions.choose({
                title: 'Select a keyword',
                message:
                    '{player} uses {source} and kneels their faction card to have {target} gain {choice} until the end of the phase',
                choices: Object.fromEntries(
                    ['Insight', 'Intimidate', 'Renown', 'Stealth'].map((keyword) => [
                        keyword,
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.addKeyword(keyword.toLowerCase())
                        }))
                    ])
                )
            })
        });
    }
}

TheBrotherhoodWithoutBanners.code = '06119';

export default TheBrotherhoodWithoutBanners;
