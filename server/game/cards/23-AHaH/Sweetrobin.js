const DrawCard = require('../../drawcard.js');

class Sweetrobin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.immuneTo(card => card.getType() === 'plot')
        });

        this.forcedReaction({
            when: {
                onChallengeInitiated: event => event.challenge.challengeType === 'military'
            },
            message: '{player} is forced by {source} to either reveal their hand/shadows, or reduce the claim on their revealed plot card by 1 until the end of the challenge',
            handler: context => {
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: `Choose one for ${this.name}`,
                        buttons: [
                            { text: 'Reveal hand and shadows', method: 'reveal' },
                            { text: 'Reduce claim', method: 'reduce' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    reveal(player) {
        let revealing = this.game.allCards.filter(card => card.controller === player && ['hand', 'shadows'].includes(card.location));
        // this.resolveGameAction(GameActions.simultaneously(revealing.map(reveal => GameActions.revealCard({ card: reveal })))); // TODO: Update to this with Alla update
        this.game.addMessage('{0} chooses to reveal {1} from their hand and shadows area', player, revealing);
        return true;
    }
    reduce(player) {
        this.untilEndOfChallenge(ability => ({
            match: card => card === player.activePlot,
            effect: ability.effects.modifyClaim(-1)
        }));
        this.game.addMessage('{0} chooses to reduce the claim on their revealed plot card by 1 until the end of the challenge', player);
        return true;
    }
}

Sweetrobin.code = '23020';

module.exports = Sweetrobin;
