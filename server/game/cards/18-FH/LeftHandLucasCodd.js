import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class LeftHandLucasCodd extends DrawCard {
    // Left-Hand Lucas Codd (18003)
    // Stealth.
    // Reaction: After no defenders are declared in a challenge in which you control an attacking
    // Raider character, place 1 gold from the treasury on a card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDefendersDeclared: (event, context) =>
                    event.player !== context.player &&
                    event.numOfDefendingCharacters === 0 &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('Raider') &&
                            card.getType() === 'character'
                    )
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select card to place 1 gold on',
                cardCondition: (card) => card.location === 'play area'
            },
            message: '{player} uses {source} to place 1 gold from the treasury on {target}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.target,
                token: Tokens.gold
            }))
        });
    }
}

LeftHandLucasCodd.code = '18003';

export default LeftHandLucasCodd;
