import PlotCard from '../../plotcard.js';

class WeTakeWesteros extends PlotCard {
    // We Take Westeros! (17109)
    // Challenges Action: Kneel a Raider character to choose a location with lower printed cost in a
    // discard pile and put it into play under your control. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            phase: 'challenge',
            title: 'Put location into play',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Raider')
            ),
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a location',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'discard pile' &&
                        card.getType() === 'location' &&
                        context.player.canPutIntoPlay(card) &&
                        card.getPrintedCost() < context.costs.kneel.getPrintedCost(),
                    onSelect: (player, card) => {
                        player.putIntoPlay(card);
                        this.game.addMessage(
                            "{0} uses {1} and kneels {2} put {3} into play from {4}'s discard pile ",
                            player,
                            this,
                            context.costs.kneel,
                            card,
                            card.owner
                        );
                        return true;
                    }
                });
            }
        });
    }
}

WeTakeWesteros.code = '17109';

export default WeTakeWesteros;
