const DrawCard = require('../../drawcard.js');

class WhenIWoke extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.challengeType === 'military' && event.challenge.loser !== undefined 
            },
            max: ability.limit.perChallenge(1),
            handler: () => {
                
                var losingplayer = this.game.currentChallenge.loser;
                this.game.promptForSelect(losingplayer, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: card => this.game.currentChallenge.isParticipating(card),
                    gameAction: 'moveToTopOfDeck',
                    onSelect: (losingplayer, card) => this.onSelectCard(losingplayer, card),
                    onCancel: (losingplayer) => this.onSelectCard(losingplayer, null)
                });
            }
        });
    }

    onSelectCard(player,card) {
        if(card === null) {
            this.game.addAlert('danger','{0} does not choose any card for {1}', player, this);
            return true;
        }
        
        player.moveCardToTopOfDeck(card);
        this.game.addMessage('{0} chooses {1} for {2} ', player, card, this);
        return true;

    }
}

WhenIWoke.code = '12044';

module.exports = WhenIWoke;
