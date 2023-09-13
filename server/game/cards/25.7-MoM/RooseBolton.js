const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            message: '{player} is forced by {source} to kneel their faction card',
            gameAction: GameActions.kneelCard(context => ({ card: context.player.faction, source: this })).then({
                message: 'Then, each other loyal character is killed',
                gameAction: GameActions.simultaneously(context =>
                    this.getEachOtherLoyalCharacter(context).map(card => GameActions.kill(context => ({ card, player: context.player })))
                )
            })
        });
    }

    getEachOtherLoyalCharacter(context) {
        return context.game.filterCardsInPlay(card => card.getType() === 'character' && card.isLoyal() && card !== this);
    }
}

RooseBolton.code = '25561';
RooseBolton.version = '1.1';

module.exports = RooseBolton;
