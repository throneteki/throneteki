import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            chooseOpponent: true,
            message: {
                format: "{player} uses {source} to discard the top card of {opponent}'s deck",
                args: { opponent: (context) => context.opponent }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardTopCards((context) => ({
                        player: context.opponent,
                        amount: 1
                    })).then({
                        condition: (context) =>
                            context.event.topCards.some((card) => card.getType() === 'event'),
                        message: 'Then, {player} stands {source}',
                        gameAction: GameActions.standCard({ card: this })
                    }),
                    context
                );
            },
            limit: ability.limit.perRound(2)
        });
    }
}

EuronCrowsEye.code = '27513';
EuronCrowsEye.version = '1.0.0';

export default EuronCrowsEye;
