import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordCommander extends DrawCard {
    // Lord Commander (11066)
    // [thenightswatch] character with printed cost 5 or higher only.
    // Reaction: After you win a challenge in which you control a participating [thenightswatch]
    // character, attached character gains 1 power.
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'thenightswatch', printedCostOrHigher: 5 });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.hasParticipatingNWCharacter()
            },
            message: {
                format: '{player} uses {source} to gain 1 power on {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }

    hasParticipatingNWCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.isFaction('thenightswatch')
        );
    }
}

LordCommander.code = '11066';

export default LordCommander;
