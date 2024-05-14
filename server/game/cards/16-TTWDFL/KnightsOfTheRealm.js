import AgendaCard from '../../agendacard.js';

class KnightsOfTheRealm extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controlsMoreKnights(),
            targetController: 'current',
            effect: ability.effects.modifyDrawPhaseCards(1)
        });

        this.persistentEffect({
            condition: () => this.controlsFewerKnights(),
            targetController: 'current',
            effect: ability.effects.modifyDrawPhaseCards(-1)
        });
    }

    controlsMoreKnights() {
        const controlledKnights = this.controller.getNumberOfCardsInPlay({
            trait: 'Knight',
            type: 'character'
        });
        return this.game
            .getOpponents(this.controller)
            .every(
                (opponent) =>
                    controlledKnights >
                    opponent.getNumberOfCardsInPlay({ trait: 'Knight', type: 'character' })
            );
    }

    controlsFewerKnights() {
        const controlledKnights = this.controller.getNumberOfCardsInPlay({
            trait: 'Knight',
            type: 'character'
        });
        return this.game
            .getOpponents(this.controller)
            .every(
                (opponent) =>
                    controlledKnights <
                    opponent.getNumberOfCardsInPlay({ trait: 'Knight', type: 'character' })
            );
    }
}

KnightsOfTheRealm.code = '16029';

export default KnightsOfTheRealm;
