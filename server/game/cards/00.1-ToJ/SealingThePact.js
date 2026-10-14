import AgendaCard from '../../agendacard.js';

class SealingThePact extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingInFaction()
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.isFaction(this.controller.getFaction()) &&
                    !card.isFaction('neutral'),
                gameAction: 'gainPower'
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    hasParticipatingInFaction() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isParticipating() &&
                card.isFaction(this.controller.getFaction()) &&
                card.getType() === 'character'
        );
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        for (const card of this.game.allCards) {
            if (card.owner === this.owner && !factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        }

        let factionToAnnounce = factionsInDecks.filter(
            (faction) => faction !== this.controller.getFaction() && faction !== 'neutral'
        );
        let message = '{0} names {1} as their {2} for {3}';

        if (factionToAnnounce.length > 1) {
            message += ' (this exceeds the maximum allowed number of factions)';
            this.game.addAlert(
                'danger',
                message,
                this.controller,
                factionToAnnounce,
                factionToAnnounce.length > 1 ? 'factions' : 'faction',
                this
            );
            return;
        }

        if (factionToAnnounce.length === 0) {
            //Don't print any message: allows the player to bluff any faction
            return;
        }

        this.game.addMessage(
            message,
            this.controller,
            factionToAnnounce,
            factionToAnnounce.length > 1 ? 'factions' : 'faction',
            this
        );
    }
}

SealingThePact.code = '00362';

export default SealingThePact;
