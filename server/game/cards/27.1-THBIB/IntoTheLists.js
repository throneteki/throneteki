import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class IntoTheLists extends PlotCard {
    // Into the Lists (27019)
    // When Revealed: Each player may choose and kneel a non-Army character they control with a
    // [military] icon. Then, if exactly 1 character has the highest STR among characters knelt this
    // way, it gains 2 power.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                optional: true,
                ifAble: true,
                activePromptTitle: 'Select a character to kneel',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer &&
                    !card.kneeled &&
                    !card.hasTrait('Army') &&
                    card.hasIcon('military'),
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to have each player kneel a character',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.targets.getTargets().map((card) => GameActions.kneelCard({ card }))
                    ).then({
                        condition: (context) => !!this.getChampion(context.event),
                        message: {
                            format: 'Then, {champion} gains 2 power',
                            args: { champion: (context) => this.getChampion(context.event) }
                        },
                        gameAction: GameActions.gainPower((context) => ({
                            card: this.getChampion(context.event),
                            amount: 2
                        }))
                    }),
                    context
                );
            }
        });
    }

    getChampion(event) {
        const knelt = event
            .getConcurrentEvents()
            .filter((event) => event.name === 'onCardKneeled')
            .map((event) => event.card);
        const inPlay = knelt.filter((card) => card.location === 'play area');

        if (inPlay.length === 0) {
            return undefined;
        }

        const highestStrength = Math.max(...inPlay.map((card) => card.getStrength()));
        const champions = inPlay.filter((card) => card.getStrength() === highestStrength);

        return champions.length === 1 ? champions[0] : undefined;
    }
}

IntoTheLists.code = '27019';

export default IntoTheLists;
