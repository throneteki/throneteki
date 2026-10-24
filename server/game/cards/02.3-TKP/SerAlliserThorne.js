import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerAlliserThorne extends DrawCard {
    // Ser Alliser Thorne (02045)
    // While you are the defending player, each [thenightswatch] character you control gains a
    // [military] icon.
    // Reaction: After a [military] challenge is initiated against you, kneel your faction card and
    // pay 4 gold to put Ser Alliser Thorne into play from your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ defendingPlayer: context.source.controller }),
            match: (card) => card.getType() === 'character' && card.isFaction('thenightswatch'),
            effect: ability.effects.addIcon('military')
        });

        this.reaction({
            location: 'hand',
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedChallengeType === 'military' &&
                    event.challenge.initiatedAgainstPlayer === context.source.controller &&
                    context.source.controller.canPutIntoPlay(context.source)
            },
            cost: [ability.costs.kneelFactionCard(), ability.costs.payGold(4)],
            message: '{player} uses {source} to put {source} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

SerAlliserThorne.code = '02045';

export default SerAlliserThorne;
