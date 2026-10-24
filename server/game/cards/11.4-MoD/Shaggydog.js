import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Shaggydog extends DrawCard {
    // Shaggydog (11062)
    // [stark] character you control only.
    // Reaction: After you win a challenge in which attached character is attacking, the losing
    // opponent must choose and kill a defending character.
    // Action: Pay 1 gold to attach Shaggydog to a different character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', controller: 'current' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source.parent)
            },
            message: {
                format: '{player} uses {source} to have {loser} choose and kill a defending character',
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.challenge.loser,
                title: 'Select a character to kill',
                cardCondition: (card, context) =>
                    card.isDefending() && card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kill({ card })
            })
        });
        this.action({
            title: 'Attach Shaggydog to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} pays 1 gold to attach {source} to {target}',
            gameAction: GameActions.attach((context) => ({
                attachment: context.source,
                target: context.target
            }))
        });
    }
}

Shaggydog.code = '11062';

export default Shaggydog;
