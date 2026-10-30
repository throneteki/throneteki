import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWall extends DrawCard {
    // The Wall (01137)
    // Each [thenightswatch] character you control gets +1 STR.
    // Forced Reaction: After you lose an unopposed challenge, kneel The Wall.
    // Interrupt: When the challenges phase ends, kneel The Wall to gain 2 power for your faction.
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    !context.source.kneeled &&
                    event.challenge.isUnopposed()
            },
            message: '{player} is forced to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' && context.source.controller.canGainFactionPower()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            }))
        });
        this.persistentEffect({
            match: (card) => card.isFaction('thenightswatch') && card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });
    }
}

TheWall.code = '01137';

export default TheWall;
