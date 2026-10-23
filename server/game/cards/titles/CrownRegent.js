import TitleCard from '../../TitleCard.js';
import GameActions from '../../GameActions/index.js';

class CrownRegent extends TitleCard {
    // Crown Regent (01211)
    // Supported by None
    // Supports: None
    // Rivals: None
    // You may redirect 1 challenge this round.
    // +2 STR for Dominance
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'title',
            match: this,
            effect: ability.effects.modifyDominanceStrength(2)
        });

        this.interrupt({
            cannotBeCanceled: true,
            location: 'title',
            when: {
                onChallengeRedirectable: () => true
            },
            message: {
                format: '{player} uses {source} to force {initiatingPlayer} to redirect the challenge to another player',
                args: { initiatingPlayer: (context) => context.event.challenge.initiatingPlayer }
            },
            gameAction: GameActions.choose({
                player: (context) => context.event.challenge.initiatingPlayer,
                title: 'Select an opponent',
                cancelable: false,
                message: '{choosingPlayer} {gameAction}',
                choices: (context) => {
                    const challenge = context.event.challenge;
                    return Object.fromEntries(
                        context.game
                            .getOpponents(challenge.initiatingPlayer)
                            .map((player) => ({
                                player,
                                action: GameActions.redirectChallenge({ challenge, player })
                            }))
                            .filter(({ action }) => action.allow(context))
                            .map(({ player, action }) => [player.name, action])
                    );
                }
            }),
            limit: ability.limit.perRound(1)
        });
    }
}

CrownRegent.code = '01211';

export default CrownRegent;
