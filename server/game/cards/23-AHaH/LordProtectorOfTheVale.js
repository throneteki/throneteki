const DrawCard = require('../../drawcard.js');
const {ChallengeTracker} = require('../../EventTrackers');
const GameActions = require('../../GameActions/index.js');

class LordProtectorOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.attachmentRestriction({ trait: 'Lord', loyal: false });

        this.whileAttached({
            effect: ability.effects.addTrait('House Arryn')
        });

        this.whileAttached({
            match: card => card.name === 'Littlefinger',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' &&
                    this.tracker.some({ not: { loser: this.controller } })
            },
            message: {
                format: '{player} uses {source} to draw {amount} cards',
                args: { amount: () => this.tracker.count({ not: { loser: this.controller } }) }
            },
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: this.tracker.count({ not: { loser: this.controller } }), source: this }))
        });
    }
}

LordProtectorOfTheVale.code = '23035';

module.exports = LordProtectorOfTheVale;
