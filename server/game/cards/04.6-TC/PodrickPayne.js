import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PodrickPayne extends DrawCard {
    // Podrick Payne (04109)
    // Interrupt: When a character would be killed for [military] claim, pay 2 gold and put Podrick
    // Payne into play from your hand to save it. Then, if that character was Tyrion Lannister, you
    // may pay 2 gold to choose and kill an attacking character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            location: 'hand',
            when: {
                onCharacterKilled: (event, context) =>
                    event.isClaim &&
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === context.player
            },
            cost: [ability.costs.payGold(2), ability.costs.putSelfIntoPlay()],
            message: {
                format: '{player} puts {source} into play and pays 2 gold to save {character}',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event })).then({
                condition: (context) =>
                    context.parentContext.event.card.name === 'Tyrion Lannister' &&
                    context.player.getSpendableGold() >= 2 &&
                    context.game.currentChallenge &&
                    context.game.currentChallenge.attackers.length >= 1,
                gameAction: GameActions.may({
                    title: 'Pay two gold to kill an attacking character?',
                    message:
                        'Then {player} uses {source} and pays 2 gold to kill an attacking character',
                    gameAction: GameActions.simultaneously([
                        GameActions.returnGoldToTreasury((context) => ({
                            player: context.player,
                            amount: 2
                        })),
                        GameActions.chooseCards({
                            title: 'Select a character',
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.getType() === 'character' &&
                                card.isAttacking(),
                            gameAction: (card) => GameActions.kill({ card })
                        })
                    ])
                })
            })
        });
    }
}

PodrickPayne.code = '04109';

export default PodrickPayne;
