export const Flags = Object.freeze({
    blanks: Object.freeze({
        excludingTraits: Symbol('blanks.excludingTraits'),
        full: Symbol('blanks.full')
    }),
    card: Object.freeze({
        entersPlayKneeled: Symbol('card.entersPlayKneeled'),
        notConsideredToBeInPlotDeck: Symbol('card.notConsideredToBeInPlotDeck')
    }),
    challengeOptions: Object.freeze({
        canBeDeclaredWhileKneeling: Symbol('challengeOptions.canBeDeclaredWhileKneeling'),
        canBeDeclaredWithoutIcon: Symbol('challengeOptions.canBeDeclaredWithoutIcon'),
        doesNotContributeStrength: Symbol('challengeOptions.doesNotContributeStrength'),
        doesNotKneelAsAttacker: function (challengeType) {
            return Symbol.for(`challengeOptions.doesNotKneelAsAttacker.${challengeType}`);
        },
        doesNotKneelAsDefender: function (challengeType) {
            return Symbol.for(`challengeOptions.doesNotKneelAsDefender.${challengeType}`);
        },
        ignoresAssaultLocationCost: Symbol('challengeOptions.ignoresAssaultLocationCost'),
        mustBeDeclaredAsAttacker: Symbol('challengeOptions.mustBeDeclaredAsAttacker'),
        mustBeDeclaredAsDefender: Symbol('challengeOptions.mustBeDeclaredAsDefender'),
    }),
    dominanceOptions: Object.freeze({
        contributesWhileKneeling: Symbol('dominanceOptions.contributesWhileKneeling'),
        doesNotContribute: Symbol('dominanceOptions.doesNotContribute'),
    }),
    game: Object.freeze({
        skipPhase: function (phase) {
            return Symbol.for(`game.skipPhase.${phase}`);
        }
    }),
    losesAspect: Object.freeze({
        allFactions: Symbol('losesAspect.allFactions'),
        faction: function (factionName) {
            return Symbol.for(`losesAspect.factions.${factionName}`);
        },
        keywords: Symbol('losesAspect.keywords'),
        immunity: Symbol('loseAspect.immunity'),
        traits: Symbol('losesAspect.traits')
    }),
    player: Object.freeze({
        cannotBeFirstPlayer: Symbol('player.cannotBeFirstPlayer'),
        cannotGainChallengeBonus: Symbol('player.cannotGainChallengeBonus'),
        cannotGainDominancePower: Symbol('player.cannotGainDominancePower'),
        cannotRevealPlot: Symbol('player.cannotRevealPlot'),
        cannotWinChallenge: Symbol('player.cannotWinChallenge'),
        cannotWinGame: Symbol('player.cannotWinGame'),
        doesNotReturnUnspentGold: Symbol('player.doesNotReturnUnspentGold')
    }),
    plotModifiers: Object.freeze({
        cannotProvide: function (modifier) {
            return Symbol.for(`plotModifiers.cannotProvide.${modifier}`);
        }
    }),
    powerOptions: Object.freeze({
        doesNotContribute: Symbol('powerOptions.doesNotContribute')
    }),
    standingOptions: Object.freeze({
        optionalStand: Symbol('standingOptions.optionalStand')
    })
});
