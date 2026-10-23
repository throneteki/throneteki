import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class LegacyOfTheWatch extends DrawCard {
    // Legacy of the Watch (25050)
    // Unique [thenightswatch] location you control only.
    // Reaction: After you win a challenge by 5 or more STR, if you control 2 or more participating:
    // - Ranger characters, gain 1 power for your faction.
    // - Steward characters, draw 2 cards.
    // - Builder characters, stand a [thenightswatch] location.
    setupCardAbilities() {
        this.attachmentRestriction({
            type: 'location',
            faction: 'thenightswatch',
            controller: 'current',
            unique: true
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            gameAction: GameActions.simultaneously([
                GameActions.ifCondition({
                    condition: (context) => participatingWithTrait(context, 'Ranger') >= 2,
                    thenAction: {
                        message: '{player} uses {source} to gain 1 power for their faction',
                        gameAction: GameActions.gainPower((context) => ({
                            card: context.player.faction,
                            amount: 1
                        }))
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => participatingWithTrait(context, 'Steward') >= 2,
                    thenAction: {
                        message: '{player} uses {source} to draw 2 cards',
                        gameAction: GameActions.drawCards((context) => ({
                            player: context.player,
                            amount: 2
                        }))
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => participatingWithTrait(context, 'Builder') >= 2,
                    thenAction: {
                        message: '{player} uses {source} to stand a [thenightswatch] location',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a location',
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.getType() === 'location' &&
                                card.isFaction('thenightswatch') &&
                                card.kneeled,
                            gameAction: (card) => GameActions.standCard({ card })
                        })
                    }
                })
            ])
        });
    }
}

function participatingWithTrait(context, trait) {
    return context.event.challenge
        .getParticipants()
        .filter((card) => card.controller === context.player && card.hasTrait(trait)).length;
}

LegacyOfTheWatch.code = '25050';

export default LegacyOfTheWatch;
