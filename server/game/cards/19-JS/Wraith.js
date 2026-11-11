import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Wraith extends DrawCard {
    // Wraith (19001)
    // While you control Dale Seaworth, he gains stealth.
    // Action: Kneel and sacrifice Wraith to choose and kneel a location.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Dale Seaworth' && card.controller === context.source.controller,
            effect: ability.effects.addKeyword('stealth')
        });

        this.action({
            title: 'Kneel location',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} kneels and sacrifices {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

Wraith.code = '19001';

export default Wraith;
