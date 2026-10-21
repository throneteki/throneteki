import DrawCard from '../../drawcard.js';

class RobertBaratheon extends DrawCard {
    // Robert Baratheon (14001)
    // Renown.
    // Reaction: After the standing phase begins (choose one):
    // - other characters with printed cost 5 or higher cannot stand this phase.
    // - characters with printed cost 4 or lower cannot stand this phase.
    // - locations cannot stand this phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'standing'
            },
            choices: {
                'Printed Cost 5+': (context) => {
                    this.applyCannotStand({
                        context,
                        cards: this.getPrintedCost5OrHigher()
                    });
                },
                'Printed Cost 4-': (context) => {
                    this.applyCannotStand({
                        context,
                        cards: this.getPrintedCost4OrLower()
                    });
                },
                Locations: (context) => {
                    this.applyCannotStand({
                        context,
                        cards: this.getLocations()
                    });
                }
            }
        });
    }

    applyCannotStand({ cards, context }) {
        this.game.addMessage(
            '{0} uses {1} to prevent {2} from standing this phase',
            context.player,
            this,
            cards
        );
        this.untilEndOfPhase((ability) => ({
            match: cards,
            effect: ability.effects.cannotBeStood()
        }));
    }

    getPrintedCost5OrHigher() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.getPrintedCost() >= 5 && card !== this
        );
    }

    getPrintedCost4OrLower() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.getPrintedCost() <= 4
        );
    }

    getLocations() {
        return this.game.filterCardsInPlay((card) => card.getType() === 'location');
    }
}

RobertBaratheon.code = '14001';

export default RobertBaratheon;
