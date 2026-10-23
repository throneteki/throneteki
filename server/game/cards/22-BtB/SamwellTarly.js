import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SamwellTarly extends DrawCard {
    // Samwell Tarly (22013)
    // Reaction: After you win a challenge in which Samwell Tarly is participating, if your reserve
    // value is:
    // - 6 or higher, draw 1 card.
    // - 8 or higher, gain 1 power for your faction.
    // - 10 or higher, choose and stand another character that shares a Trait with him, if able.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            gameAction: GameActions.simultaneously([
                GameActions.ifCondition({
                    condition: (context) => context.player.getReserve() >= 6,
                    thenAction: {
                        message: '{player} uses {source} to draw 1 card',
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 1
                        }))
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => context.player.getReserve() >= 8,
                    thenAction: {
                        message: '{player} uses {source} to gain 1 power for their faction',
                        gameAction: GameActions.gainPower((context) => ({
                            card: context.player.faction,
                            amount: 1
                        }))
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => context.player.getReserve() >= 10,
                    thenAction: {
                        message:
                            '{player} uses {source} to stand another character that shares a Trait with {source}',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a character',
                            cardCondition: (card, context) => canStand(card, context.source),
                            gameAction: (card) => GameActions.standCard({ card })
                        })
                    }
                })
            ])
        });
    }
}

function canStand(card, samwell) {
    return (
        card !== samwell &&
        card.location === 'play area' &&
        card.getType() === 'character' &&
        card.kneeled &&
        card.getTraits().some((trait) => samwell.hasTrait(trait))
    );
}

SamwellTarly.code = '22013';

export default SamwellTarly;
