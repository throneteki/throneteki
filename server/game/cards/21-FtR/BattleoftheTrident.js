import AgendaCard from '../../agendacard.js';
import RevealPlots from '../../gamesteps/revealplots.js';
import SimpleStep from '../../gamesteps/simplestep.js';

class BattleoftheTrident extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event) =>
                    event.challenge &&
                    event.challenge.winner === this.owner &&
                    event.challenge.attackingPlayer === this.owner &&
                    event.challenge.attackers.some(
                        (attacker) => attacker.hasTrait('Army') || attacker.hasTrait('Commander')
                    ) &&
                    !this.owner.hasFlag('cannotRevealPlot')
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'plot deck' &&
                    card.hasTrait(
                        this.translateChallengeTypeToTrait(context.event.challenge.challengeType)
                    ),
                cardType: 'plot'
            },
            handler: (context) => this.trigger(context)
        });

        this.action({
            title: 'Manually trigger',
            cost: ability.costs.kneelFactionCard(),
            condition: () => !this.owner.hasFlag('cannotRevealPlot'),
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                //do not filter the plotTrait when triggering manually
                cardCondition: (card, context) =>
                    card.controller === context.player && card.location === 'plot deck',
                cardType: 'plot'
            },
            handler: (context) => this.trigger(context)
        });

        //this reaction is not intended to trigger, only to be used directly by the trigger() function
        //TODO convert revealing a plot into a game action so this fake reaction can be put into a then part of a game action
        this.reaction({
            title: 'removeFromGameMarker',
            when: {
                onClaimApplied: () => false
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a plot',
                cardCondition: (card) =>
                    card.controller === this.controller && card.location === 'revealed plots',
                cardType: 'plot'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} then removes {1} from the game',
                    context.player,
                    context.target
                );
                this.lastingEffect((ability) => ({
                    until: {
                        onCardPlaced: (event) =>
                            event.card.getType() === 'plot' &&
                            event.player === context.player &&
                            context.player.getPlots().length === 1
                    },
                    match: context.target,
                    targetLocation: ['revealed plots', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));
            }
        });
    }

    trigger(context) {
        this.game.addMessage(
            '{0} uses {1} and kneels their faction card to reveal {2}',
            context.player,
            this,
            context.target
        );

        context.player.selectedPlot = context.target;
        this.game.queueStep(new RevealPlots(this.game, [context.target]));
        this.game.queueStep(
            new SimpleStep(this.game, () => {
                if (context.player.plotDiscard.length > 0) {
                    let removeFromGameAction = this.abilities.reactions.find(
                        (reaction) => reaction.title === 'removeFromGameMarker'
                    );
                    if (removeFromGameAction) {
                        let removeContext = removeFromGameAction.createContext(context.event);
                        removeContext.player = context.player;
                        this.game.resolveAbility(removeFromGameAction, removeContext);
                    }
                }
            })
        );
    }

    translateChallengeTypeToTrait(challengeType) {
        if (challengeType) {
            switch (challengeType) {
                case 'military':
                    return 'War';
                case 'intrigue':
                    return 'Edict';
                case 'power':
                    return 'Siege';
                default:
                    return '';
            }
        }
    }
}

BattleoftheTrident.code = '21030';

export default BattleoftheTrident;
