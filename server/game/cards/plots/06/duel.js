const PlotCard = require('../../../plotcard.js');

class Duel extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                if(!opponent) {
                    return;
                }

                if(this.notEnoughTargets()) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to have {2} choose 2 non-Army characters with printed cost 6 or higher', 
                    this.controller, this, opponent);

                this.game.promptForSelect(opponent, {
                    numCards: 2,
                    activePromptTitle: 'Select two characters',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        !card.hasTrait('Army') && 
                        card.getType() === 'character' && 
                        card.getCost() >= 6),
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        if(cards.length !== 2) {
            return false;
        }

        this.targets = cards;
        this.game.addMessage('{0} has chosen {1} as the targets for {2}', player, cards, this);

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Choose character to kneel',
                buttons: [
                    { card: cards[0], method: 'resolve', arg: [0,1]},
                    { card: cards[1], method: 'resolve', arg: [1,0]},
                    { text: 'Cancel', method: 'cancel'}
                ]
            },
            source: this
        });

        return true;
    }

    resolve(player, index) {
        player.kneelCard(this.targets[index[0]]);
        this.game.killCharacter(this.targets[index[1]], false);

        this.game.addMessage('{0} then chooses {1} to kneel, {2} is killed', player, this.targets[index[0]], this.targets[index[1]]);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }

    notEnoughTargets() {
        let targets = this.game.findAnyCardsInPlay(card => !card.hasTrait('Army') && card.getType() === 'character' && card.getCost() >= 6);
        return targets.length <= 1;
    }
}

Duel.code = '06060';

module.exports = Duel;
