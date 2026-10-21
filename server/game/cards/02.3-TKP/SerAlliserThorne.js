import DrawCard from '../../drawcard.js';

class SerAlliserThorne extends DrawCard {
    // Ser Alliser Thorne (02045)
    // While you are the defending player, each [thenightswatch] character you control gains a
    // [military] icon.
    // Reaction: After a [military] challenge is initiated against you, kneel your faction card and
    // pay 4 gold to put Ser Alliser Thorne into play from your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            match: (card) => card.getType() === 'character' && card.isFaction('thenightswatch'),
            effect: ability.effects.addIcon('military')
        });

        this.reaction({
            location: 'hand',
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedChallengeType === 'military' &&
                    event.challenge.initiatedAgainstPlayer === this.controller &&
                    this.controller.canPutIntoPlay(this)
            },
            cost: [ability.costs.kneelFactionCard(), ability.costs.payGold(4)],
            handler: () => {
                this.controller.putIntoPlay(this);

                this.game.addMessage(
                    '{0} uses {1} to put {1} into play from their hand',
                    this.controller,
                    this
                );
            }
        });
    }
}

SerAlliserThorne.code = '02045';

export default SerAlliserThorne;
