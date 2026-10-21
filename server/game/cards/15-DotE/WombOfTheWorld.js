import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WombOfTheWorld extends DrawCard {
    // Womb of the World (15017)
    // Action: Kneel Womb of the World to reveal the top 5 cards of your deck. You may chose a
    // Dothraki character revealed this way and put it into play. Shuffle your deck. At the end of
    // the phase, if that character is still in play, return it to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 5 cards',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reveal the top 5 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 5,
                whileRevealed: GameActions.genericHandler((context) => {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Select a character',
                        cardCondition: (card) =>
                            context.revealed.includes(card) &&
                            card.isMatch({ trait: 'Dothraki', type: 'character' }) &&
                            context.player.canPutIntoPlay(card),
                        onSelect: (player, card) => this.putCharacterIntoPlay(player, card),
                        onCancel: (player) => this.promptToCancel(player),
                        source: this
                    });
                })
            })).then({
                message: '{player} shuffles their deck',
                gameAction: GameActions.shuffle((context) => ({ player: context.player }))
            })
        });
    }

    putCharacterIntoPlay(player, card) {
        player.putIntoPlay(card);
        this.atEndOfPhase((ability) => ({
            match: card,
            condition: () => 'play area' === card.location,
            effect: ability.effects.returnToHandIfStillInPlay(true)
        }));
        this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);
        return true;
    }

    promptToCancel(player) {
        this.game.addMessage('{0} uses {1} but does not put any character into play', player, this);
        return true;
    }
}

WombOfTheWorld.code = '15017';

export default WombOfTheWorld;
