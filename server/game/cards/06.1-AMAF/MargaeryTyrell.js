import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card.isUnique() &&
                    (event.cardStateWhenKilled.hasTrait('King') ||
                        event.cardStateWhenKilled.hasTrait('Lord')) &&
                    event.cardStateWhenKilled.controller === this.controller
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to search their deck for a King or Lord character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', unique: true, trait: ['King', 'Lord'] },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

MargaeryTyrell.code = '06003';

export default MargaeryTyrell;
