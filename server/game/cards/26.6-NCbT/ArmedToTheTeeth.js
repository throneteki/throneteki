import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ArmedToTheTeeth extends AgendaCard {
    // Armed to the Teeth (26120)
    // Your deck cannot include non-Weapon attachments.
    // After all agendas are announced, search your deck for up to 5 different attachments, reveal
    // them, and place them facedown under this agenda.
    // Reaction: After you win a challenge, kneel your faction card and pay X gold to put an
    // attachment with printed cost X into play from under this agenda.
    setupCardAbilities(ability) {
        this.afterAgendasAnnounced({
            gameAction: GameActions.search({
                title: 'Select up to 5 attachments',
                match: {
                    type: 'attachment',
                    trait: 'Weapon',
                    condition: (card, context) =>
                        !context.selectedCards.some((sc) => sc !== card && sc.name === card.name)
                },
                reveal: true,
                numToSelect: 5,
                message: '{player} places {searchTarget} facedown under {source}',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) =>
                        GameActions.placeCardUnderneath({
                            card,
                            parentCard: context.player.agenda,
                            facedown: true
                        })
                    )
                )
            })
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    (context) => Math.min(...attachmentCosts(context.player)),
                    (context) => Math.max(...attachmentCosts(context.player))
                )
            ],
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    context.player.agenda.underneath.includes(card) &&
                    card.getType() === 'attachment' &&
                    card.getCost() !== '-' &&
                    (context.xValue === undefined || card.getPrintedCost() === context.xValue) &&
                    GameActions.putIntoPlay({ card }).allow()
            },
            message: {
                format: '{player} uses {source}, kneels their faction card and pays {xValue} gold to put {target} into play from underneath {source}',
                args: { xValue: (context) => context.xValue }
            },
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target }))
        });
    }
}

function attachmentCosts(player) {
    return player.agenda.underneath
        .filter((card) => card.getType() === 'attachment' && card.getCost() !== '-')
        .map((card) => card.getPrintedCost());
}

ArmedToTheTeeth.code = '26120';

export default ArmedToTheTeeth;
