import DrawCard from '../../drawcard.js';

class MyrcellaBaratheon extends DrawCard {
    // Myrcella Baratheon (04095)
    // While there are no King characters in play, Myrcella Baratheon gains renown and does not
    // kneel when declared as a defender in a [power] challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.areNoKingsInPlay(),
            match: this,
            effect: ability.effects.doesNotKneelAsDefender({ challengeType: 'power' })
        });

        this.persistentEffect({
            condition: () => this.areNoKingsInPlay(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    areNoKingsInPlay() {
        return !this.game.getPlayers().some((player) => {
            return player.anyCardsInPlay(
                (card) => card.getType() === 'character' && card.hasTrait('King')
            );
        });
    }
}

MyrcellaBaratheon.code = '04095';

export default MyrcellaBaratheon;
