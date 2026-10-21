import DrawCard from '../../drawcard.js';

class VultureKing extends DrawCard {
    // Vulture King (25048)
    // Attached character gains pillage.
    // Reaction: After you win a challenge in which attached character is participating, discard the
    // top card of your deck to choose a character controlled by the losing opponent. Until the end
    // of the phase, that character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pillage')
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.parent &&
                    this.parent.isParticipating()
            },
            cost: ability.costs.discardFromDeck(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.loser
            },
            message:
                '{player} uses {source} and discards {costs.discardFromDeck} from their deck to have {target} lose a challenge icon until the end of the phase',
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} chooses to have {1} lose {2} {3} icon until the end of the phase',
                        context.player,
                        context.target,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
    }
}

VultureKing.code = '25048';

export default VultureKing;
