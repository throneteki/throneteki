import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThePrincesPlan extends DrawCard {
    // The Prince's Plan (06016)
    // Action: Choose a character. Until the end of the phase, that character gets +1 STR for each
    // plot card in your used pile and gains a challenge icon of your choice.
    // Reaction: After you lose a challenge, pay 1 gold to return The Prince's Plan from your
    // discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +1 STR per used plot + icon',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message: {
                    format: '{player} plays {source} to give {target} +{strength} STR and {icon} icon until the end of the phase',
                    args: { strength: (context) => context.player.getNumberOfUsedPlots() }
                },
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: [
                            ability.effects.modifyStrength(context.player.getNumberOfUsedPlots()),
                            ability.effects.addIcon(icon)
                        ]
                    }))
            })
        });
        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

ThePrincesPlan.code = '06016';

export default ThePrincesPlan;
