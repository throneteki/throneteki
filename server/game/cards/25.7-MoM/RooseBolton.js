const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            message: {
                format: '{player} is forced to kill {characters} for {source}',
                args: { characters: context => this.getEachOtherLoyalCharacter(context) }
            },
            gameAction: GameActions.simultaneously(context =>
                this.getEachOtherLoyalCharacter(context)
                    .map(card => GameActions.kill(context => ({ card, player: context.player })))
            )
        });
    }

    getEachOtherLoyalCharacter(context) {
        return context.game.filterCardsInPlay(card => card.getType() === 'character' && card.isLoyal() && card !== this);
    }
}

RooseBolton.code = '25561';
RooseBolton.version = '1.0';

module.exports = RooseBolton;
