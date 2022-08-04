const DrawCard = require('../../drawcard');
const GenericTracker = require('../../EventTrackers/GenericTracker');

class TheBloodyGate extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = GenericTracker.forPhase(this.game, 'onCardEntersPlay');

        this.plotModifiers({
            initiative: -1,
            reserve: 1
        });

        this.persistentEffect({
            condition: () => !this.kneeled,
            targetController: 'any',
            match: player => this.tracker.some(event => event.card.controller === player && event.card.getType() === 'character' && event.playingType !== 'marshal'),
            effect: ability.effects.cannotPutIntoPlay((card, playingType) => card.getType() === 'character' && playingType !== 'marshal')
        });

        this.forcedReaction({
            when: {
                onInitiativeDetermined: event => event.winner === this.controller
            },
            target: {
                activePromptTitle: 'Select card to kneel',
                cardCondition: (card, context) => card === this || (card.controller === context.player && card.type === 'character' && card.hasTrait('Guard'))
            },
            message: '{player} is forced to kneel {target} for {source}',
            handler: context => {
                this.controller.kneelCard(context.target);
            }
        });
    }
}

TheBloodyGate.code = '23032';

module.exports = TheBloodyGate;
