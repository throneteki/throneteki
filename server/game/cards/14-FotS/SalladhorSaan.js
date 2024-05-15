import DrawCard from '../../drawcard.js';

class SalladhorSaan extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.playingType === 'marshal' &&
                    event.card.controller === this.controller &&
                    event.card.hasTrait('Smuggler')
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            handler: (context) => {
                this.controller.kneelCard(context.target);

                if (context.player.canGainGold()) {
                    let gold = this.game.addGold(context.player, context.target.getPrintedCost());
                    this.game.addMessage(
                        'Then {0} uses {1} to gain {2} gold',
                        context.player,
                        this,
                        gold
                    );
                }
            },
            limit: ability.limit.perRound(1)
        });
    }
}

SalladhorSaan.code = '14005';

export default SalladhorSaan;
