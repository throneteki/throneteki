import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheStallionWhoMountsTheWorld extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to search their deck for a Dothraki character',
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.ability.cannotBeCanceled ||
                    context.event.challenge.loser.getNumberOfCardsInPlay({
                        type: 'character',
                        cardCondition: (card) => GameActions.kill({ card }).allow()
                    }) < 2,
                thenAction: this.buildSearchGameAction(),
                elseAction: GameActions.choose({
                    player: (context) => context.event.challenge.loser,
                    choices: {
                        'Allow search': {
                            message: '{player} chooses to allow the deck search',
                            gameAction: this.buildSearchGameAction()
                        },
                        'Kill 2 characters': {
                            message: '{player} chooses to kill 2 characters',
                            gameAction: GameActions.genericHandler((context) => {
                                this.promptToKillCharacters(context.event.challenge.loser);
                            })
                        }
                    }
                })
            })
        });
    }

    buildSearchGameAction() {
        return GameActions.search({
            title: 'Select a character',
            match: { trait: 'Dothraki', type: 'character' },
            message: '{player} puts {searchTarget} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                card: context.searchTarget
            }))
        });
    }

    promptToKillCharacters(opponent) {
        this.game.promptForSelect(opponent, {
            activePromptTitle: 'Select two characters',
            mode: 'exactly',
            numCards: 2,
            cardCondition: (card) =>
                card.getType() === 'character' &&
                card.location === 'play area' &&
                card.controller === opponent,
            gameAction: 'kill',
            onSelect: (opponent, cards) => this.killSelectedCharacters(opponent, cards),
            onCancel: (opponent) => this.cancelResolution(opponent),
            source: this
        });
        return true;
    }

    killSelectedCharacters(opponent, cards) {
        this.game.addMessage('{0} kills {1} to cancel {2}', opponent, cards, this);
        this.game.resolveGameAction(
            GameActions.simultaneously(cards.map((card) => GameActions.kill({ card })))
        );
        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);
        return true;
    }
}

TheStallionWhoMountsTheWorld.code = '26114';

export default TheStallionWhoMountsTheWorld;
