import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MargaeryTyrell extends DrawCard {
    // Margaery Tyrell (06003)
    // Renown.
    // Reaction: After a unique King or Lord character you control is killed, search your deck for a
    // unique King or Lord character and put it into play. Shuffle your deck. (Limit once per
    // round.)
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
