import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordOfWinterfell extends DrawCard {
    // Lord of Winterfell (27012)
    // [stark] Lord character only.
    // While there is a Winter plot card revealed, attached character gains insight.
    // Reaction: After you win a challenge in which you control a participating loyal character,
    // kneel Lord of Winterfell to have attached character gain 1 power.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', trait: 'Lord' });

        this.whileAttached({
            condition: (context) =>
                context.game.getPlayers().some((player) => player.activePlot?.hasTrait('Winter')),
            effect: ability.effects.addKeyword('insight')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.controller.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            card.isLoyal() &&
                            card.getType() === 'character'
                    )
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {parent} gain 1 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({ card: context.source.parent }))
        });
    }
}

LordOfWinterfell.code = '27012';

export default LordOfWinterfell;
