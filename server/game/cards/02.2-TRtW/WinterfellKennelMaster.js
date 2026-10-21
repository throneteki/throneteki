import DrawCard from '../../drawcard.js';

class WinterfellKennelMaster extends DrawCard {
    // Winterfell Kennel Master (02021)
    // Challenges Action: If you control a participating [stark] character, kneel a Direwolf
    // character or a character with a Direwolf attachment to have it participate in the current
    // challenge on your side. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a Direwolf to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: ability.costs.kneel(
                (card) => this.isDirewolfOrHasAttachment(card) && card.canParticipateInChallenge()
            ),
            handler: (context) => {
                let card = context.costs.kneel;
                this.game.currentChallenge.addParticipantToSide(context.player, card);

                this.game.addMessage(
                    '{0} uses {1} to kneel {2} and add them to the challenge',
                    context.player,
                    this,
                    card
                );
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.isFaction('stark')
        );
    }

    isDirewolfOrHasAttachment(card) {
        return (
            card.hasTrait('Direwolf') ||
            card.attachments.some((attachment) => attachment.hasTrait('Direwolf'))
        );
    }
}

WinterfellKennelMaster.code = '02021';

export default WinterfellKennelMaster;
