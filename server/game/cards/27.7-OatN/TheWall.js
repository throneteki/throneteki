import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.getPlayers().some((player) => player.activePlot.hasTrait('Winter')),
            match: (card) => card.getType() === 'character',
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1)
        });
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'standing'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {cost.kneel} to prevent {characters} from standing this phase',
                args: { characters: () => this.getCharactersWithLowestStr() }
            },
            gameAction: GameActions.genericHandler(() => {
                const cards = this.getCharactersWithLowestStr();
                this.untilEndOfPhase((ability) => ({
                    match: cards,
                    effect: ability.effects.cannotBeStood()
                }));
            })
        });
    }

    getCharactersWithLowestStr() {
        const lowestStrCharacters = this.game
            .filterCardsInPlay((card) => card.getType() === 'character')
            .reduce((lowest, card) => {
                const currentStr = lowest[0]?.getStrength();
                if (!currentStr || currentStr === card.getStrength()) {
                    lowest.push(card);
                } else if (card.getStrength() < currentStr) {
                    lowest = [card];
                }
                return lowest;
            }, []);
        return lowestStrCharacters;
    }
}

TheWall.code = '27510';
TheWall.version = '1.0.0';

export default TheWall;
