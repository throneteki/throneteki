import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ThePrinceThatWasPromised extends AgendaCard {
    // The Prince that was Promised (14045)
    // After all agendas are announced, name a unique character.
    // Other characters you control cannot gain power.
    // Reaction: After you win a [power] challenge by 5 or more STR, kneel your faction card to,
    // either: stand the named character and draw a card; or, search your deck, discard pile, and
    // dead pile for the named character, reveal it, add it to your hand, and shuffle your deck.
    setupCardAbilities(ability) {
        this.afterAgendasAnnounced({
            gameAction: GameActions.nameCard({
                title: 'Name a unique character',
                match: (cardData) => cardData.type === 'character' && cardData.unique,
                remember: true,
                message: '{player} names {cardName} for {source}'
            })
        });
        this.persistentEffect({
            match: (card, context) =>
                card.getType() === 'character' &&
                card.controller === context.source.controller &&
                card.name.toLowerCase() !== context.source.namedCard?.toLowerCase(),
            effect: ability.effects.cannotGainPower()
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} uses {source} and kneels their faction card to either stand {namedCharacter} and draw, or search for them',
                args: { namedCharacter: (context) => context.source.namedCard }
            },
            choices: {
                'Stand and draw': {
                    message: '{player} chooses, and {gameAction}',
                    gameAction: GameActions.simultaneously((context) => {
                        const namedCharacter = context.player.filterCardsInPlay(
                            (card) =>
                                card.getType() === 'character' &&
                                card.name.toLowerCase() === context.source.namedCard.toLowerCase()
                        )[0];
                        const actions = namedCharacter
                            ? [GameActions.standCard({ card: namedCharacter })]
                            : [];
                        actions.push(
                            GameActions.drawCards((context) => ({
                                player: context.player,
                                amount: 1
                            }))
                        );
                        return actions;
                    })
                },
                Search: {
                    gameAction: GameActions.search({
                        title: 'Select a character',
                        match: {
                            type: 'character',
                            condition: (card, context) =>
                                card.name.toLowerCase() === context.source.namedCard.toLowerCase()
                        },
                        location: ['draw deck', 'discard pile', 'dead pile'],
                        message:
                            '{player} chooses to search their deck, discard pile and dead pile, and {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    })
                }
            }
        });
    }
}

ThePrinceThatWasPromised.code = '14045';

export default ThePrinceThatWasPromised;
