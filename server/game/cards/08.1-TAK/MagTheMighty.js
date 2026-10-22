import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MagTheMighty extends DrawCard {
    // Mag the Mighty (08018)
    // Renown. No attachments except Weapon.
    // Forced Reaction: After you win a challenge in which Mag the Mighty is participating, choose
    // and kill a character you control. Then, the losing opponent chooses and kills a character he
    // or she controls.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source)
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character',
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target })).then({
                target: {
                    choosingPlayer: (player, context) =>
                        player === context.parentContext.event.challenge.loser,
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.controller === context.parentContext.event.challenge.loser,
                    gameAction: 'kill'
                },
                message: {
                    format: 'Then {loser} kills {target} for {source}',
                    args: { loser: (context) => context.parentContext.event.challenge.loser }
                },
                gameAction: GameActions.kill((context) => ({ card: context.target }))
            })
        });
    }
}

MagTheMighty.code = '08018';

export default MagTheMighty;
