import TextHelper from './TextHelper.js';
import CancelChallengePrompt from './gamesteps/CancelChallengePrompt.js';
import Deck from './Deck.js';
import RematchPrompt from './gamesteps/RematchPrompt.js';
import { Tokens } from './Constants/index.js';
import Effects from './effects.js';

class ChatCommands {
    constructor(game) {
        this.game = game;
        this.commands = {
            '/add-faction': this.addFaction,
            '/add-icon': this.addIcon,
            '/add-keyword': this.addKeyword,
            '/add-trait': this.addTrait,
            '/add-card': this.addCard,
            '/bestow': this.bestow,
            '/blank': this.blank,
            '/cancel-prompt': this.cancelPrompt,
            '/cancel-challenge': this.cancelChallenge,
            '/challenge-str': this.currentChallengeStrength,
            '/discard': this.discard,
            '/disconnectme': this.disconnectMe,
            '/draw': this.draw,
            '/give-control': this.giveControl,
            '/give-icon': this.addIcon,
            '/kill': this.kill,
            '/move-bottom': this.moveBottom,
            '/move-shadows': this.moveShadows,
            '/place-under': this.placeUnder,
            '/pillage': this.pillage,
            '/power': this.power,
            '/rematch': this.rematch,
            '/remove-faction': this.removeFaction,
            '/remove-from-game': this.removeFromGame,
            '/remove-icon': this.removeIcon,
            '/remove-keyword': this.removeKeyword,
            '/remove-trait': this.removeTrait,
            '/reset-challenges-count': this.resetChallengeCount,
            '/reveal-hand': this.revealHand,
            '/str': this.strength,
            '/strength': this.strength,
            '/take-icon': this.removeIcon,
            '/token': this.setToken,
            '/unblank': this.unblank,
            '/mute-spectators': this.muteSpectators,
            '/pause-clock': this.pauseClock,
            '/add-chess-clock-time': this.addChessClockTime
        };
    }

    executeCommand(player, command, args) {
        if (!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    draw(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addAlert(
            'danger',
            '{0} uses the /draw command to draw {1} cards to their hand',
            player,
            num
        );

        player.drawCardsToHand(num);
    }

    power(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set power for',
            waitingPromptTitle: 'Waiting for opponent to set power',
            cardCondition: (card) =>
                ['faction', 'play area'].includes(card.location) && card.controller === player,
            cardType: ['attachment', 'character', 'faction', 'location'],
            onSelect: (p, card) => {
                let power = num - card.power;
                card.power += power;

                if (card.power < 0) {
                    card.power = 0;
                }

                let cardFragment = card.getType() === 'faction' ? 'their faction card' : card;
                this.game.addAlert(
                    'danger',
                    '{0} uses the /power command to set the power of {1} to {2}',
                    p,
                    cardFragment,
                    num
                );
                return true;
            }
        });
    }

    kill(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to kill character',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === player &&
                card.getType() === 'character',
            gameAction: 'kill',
            onSelect: (p, card) => {
                card.controller.killCharacter(card);

                this.game.addAlert('danger', '{0} uses the /kill command to kill {1}', p, card);
                return true;
            }
        });
    }

    blank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to blank card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.setBlank('full');

                this.game.addAlert('danger', '{0} uses the /blank command to blank {1}', p, card);
                return true;
            }
        });
    }

    unblank(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to unblank card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.clearBlank('full');

                this.game.addAlert(
                    'danger',
                    '{0} uses the /unblank command to remove the blank condition from {1}',
                    p,
                    card
                );
                return true;
            }
        });
    }

    addTrait(player, args) {
        var trait = args[1];

        if (!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add trait to card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addTrait(trait);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /add-trait command to add the {1} trait to {2}',
                    p,
                    trait,
                    card
                );
                return true;
            }
        });
    }

    removeTrait(player, args) {
        var trait = args[1];
        if (!trait) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to remove trait remove card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeTrait(trait);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /remove-trait command to remove the {1} trait from {2}',
                    p,
                    trait,
                    card
                );
                return true;
            }
        });
    }

    addKeyword(player, args) {
        var keyword = args[1];
        if (!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addKeyword(keyword);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /add-keyword command to add the {1} keyword to {2}',
                    p,
                    keyword,
                    card
                );
                return true;
            }
        });
    }

    removeKeyword(player, args) {
        var keyword = args[1];
        if (!keyword) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add keyword to card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeKeyword(keyword);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /remove-keyword command to remove the {1} keyword from {2}',
                    p,
                    keyword,
                    card
                );
                return true;
            }
        });
    }

    discard(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        this.game.addAlert(
            'danger',
            '{0} uses the /discard command to discard {1} at random',
            player,
            TextHelper.count(num, 'card')
        );

        player.discardAtRandom(num);
    }

    pillage(player) {
        this.game.addAlert(
            'danger',
            '{0} uses the /pillage command to discard 1 card from the top of their draw deck',
            player
        );

        player.discardFromDraw(1, (discarded) => {
            this.game.addMessage('{0} discards {1} due to Pillage', player, discarded);
        });
    }

    strength(player, args) {
        let num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to set strength for',
            waitingPromptTitle: 'Waiting for opponent to set strength',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === player &&
                card.getType() === 'character',
            onSelect: (p, card) => {
                let effect;
                if (typeof card.strengthSet === 'number') {
                    effect = Effects.setStrength(num);
                } else {
                    effect = Effects.modifyStrength(num - card.getStrength());
                }
                card.lastingEffect(() => ({
                    condition: () => card.location === 'play area',
                    match: card,
                    effect: effect
                }));
                this.game.addAlert(
                    'danger',
                    '{0} uses the /strength command to set the strength of {1} to {2}',
                    p,
                    card,
                    num
                );
                this.game.refreshGameState();
                return true;
            }
        });
    }

    addIcon(player, args) {
        var icon = args[1];

        if (!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give icon',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === player &&
                card.getType() === 'character',
            onSelect: (p, card) => {
                card.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === card
                    },
                    match: card,
                    effect: ability.effects.addIcon(icon)
                }));
                this.game.addAlert(
                    'danger',
                    '{0} uses the /give-icon command to give {1} a {2} icon',
                    p,
                    card,
                    icon
                );

                return true;
            }
        });
    }

    removeIcon(player, args) {
        var icon = args[1];

        if (!this.isValidIcon(icon)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to remove icon',
            cardCondition: (card) =>
                card.location === 'play area' &&
                card.controller === player &&
                card.getType() === 'character',
            onSelect: (p, card) => {
                card.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === card
                    },
                    match: card,
                    effect: ability.effects.removeIcon(icon)
                }));
                this.game.addAlert(
                    'danger',
                    '{0} uses the /take-icon command to remove a {1} icon from {2}',
                    p,
                    icon,
                    card
                );

                return true;
            }
        });
    }

    giveControl(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to give control',
            cardCondition: (card) =>
                ['play area', 'discard pile', 'dead pile'].includes(card.location) &&
                card.controller === player,
            onSelect: (p, card) => {
                this.game.promptForOpponentChoice(player, {
                    onSelect: (otherPlayer) => {
                        this.game.takeControl(otherPlayer, card);
                        this.game.addAlert(
                            'danger',
                            '{0} uses the /give-control command to pass control of {1} to {2}',
                            p,
                            card,
                            otherPlayer
                        );
                    }
                });

                return true;
            }
        });
    }

    resetChallengeCount(player) {
        player.challenges.reset();
        this.game.addAlert(
            'danger',
            '{0} uses /reset-challenges-count to reset the number of challenges performed',
            player
        );
    }

    cancelPrompt(player) {
        this.game.addAlert(
            'danger',
            '{0} uses the /cancel-prompt to skip the current step.',
            player
        );
        this.game.pipeline.cancelStep();
        this.game.cancelPromptUsed = true;
    }

    cancelChallenge(player) {
        if (!this.game.isDuringChallenge()) {
            return;
        }

        this.game.addAlert(
            'danger',
            '{0} uses /cancel-challenge to attempt to cancel the current challenge',
            player
        );
        this.game.queueStep(new CancelChallengePrompt(this.game, player));
    }

    currentChallengeStrength() {
        if (!this.game.isDuringChallenge()) {
            return;
        }

        let challenge = this.game.currentChallenge;
        challenge.calculateStrength();

        this.game.addAlert(
            'info',
            '{0} is currently attacking with {1} STR, and {2} is currently defending with {3} STR',
            challenge.attackingPlayer,
            challenge.attackerStrength,
            challenge.defendingPlayer,
            challenge.defenderStrength
        );
    }

    setToken(player, args) {
        let token = args[1];
        let num = this.getNumberOrDefault(args[2], 1);

        if (!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: (card) =>
                ['agenda', 'active plot', 'play area', 'shadows'].includes(card.location) &&
                card.controller === player,
            cardType: ['agenda', 'attachment', 'character', 'event', 'location', 'plot'],
            onSelect: (p, card) => {
                let numTokens = card.tokens[token] || 0;

                card.modifyToken(token, num - numTokens);
                this.game.addAlert(
                    'danger',
                    '{0} uses the /token command to set the {1} token count of {2} to {3}',
                    p,
                    token,
                    card,
                    num
                );

                return true;
            }
        });
    }

    bestow(player, args) {
        var num = this.getNumberOrDefault(args[1], 1);

        if (player.getSpendableGold({ activePlayer: player }) < num) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to bestow ' + num + ' gold',
            waitingPromptTitle: 'Waiting for opponent to bestow',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                this.game.transferGold({ from: player, to: card, amount: num });
                this.game.addAlert(
                    'danger',
                    '{0} uses the /bestow command to add {1} gold to {2}',
                    p,
                    num,
                    card
                );

                return true;
            }
        });
    }

    disconnectMe(player) {
        player.socket.disconnect();
    }

    addFaction(player, args) {
        let faction = args[1];
        if (!faction) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add faction to card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.addFaction(faction);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /add-faction command to add the {1} faction to {2}',
                    p,
                    faction,
                    card
                );
                return true;
            }
        });
    }

    removeFaction(player, args) {
        let faction = args[1];
        if (!faction) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to add faction to card',
            cardCondition: (card) => card.location === 'play area' && card.controller === player,
            onSelect: (p, card) => {
                card.removeFaction(faction);

                this.game.addAlert(
                    'danger',
                    '{0} uses the /remove-faction command to remove the {1} keyword from {2}',
                    p,
                    faction,
                    card
                );
                return true;
            }
        });
    }

    moveBottom(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to place a card on the bottom of their deck',
            cardCondition: (card) => card.controller === player && card.owner === player,
            onSelect: (p, card) => {
                player.moveCard(card, 'draw deck', { bottom: true });
                this.game.addAlert(
                    'danger',
                    '{0} uses the /move-bottom command to place {1} on the bottom of their deck',
                    p,
                    card
                );
                return true;
            }
        });
    }

    moveShadows(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to move a card to their shadows area',
            cardCondition: (card) => card.controller === player && card.owner === player,
            onSelect: (p, card) => {
                player.moveCard(card, 'shadows');
                this.game.addAlert(
                    'danger',
                    '{0} uses the /move-shadows command to move a card to their shadows area',
                    p
                );
                return true;
            }
        });
    }

    placeUnder(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to place',
            waitingPromptTitle: 'Waiting for opponent to select a card to place',
            cardCondition: (card) => card.controller === player && card.owner === player,
            onSelect: (p, card) => {
                this.game.promptForSelect(player, {
                    activePromptTitle: 'Select a card to place the chosen card under',
                    waitingPromptTitle:
                        'Waiting for opponent to select a card to place the selected card under',
                    cardCondition: (card) => card.controller === player && card.owner === player,
                    onSelect: (pInner, cardInner) => {
                        cardInner.lastingEffect((ability) => ({
                            until: {
                                onCardLeftPlay: (event) => event.card === cardInner
                            },
                            targetLocation: 'any',
                            match: card,
                            effect: ability.effects.placeCardUnderneath()
                        }));
                        this.game.addAlert(
                            'danger',
                            '{0} uses the /place-under command to place a card under {1}',
                            p,
                            cardInner
                        );
                        return true;
                    }
                });
                return true;
            }
        });
    }

    revealHand(player) {
        this.game.addAlert(
            'danger',
            '{0} uses the /reveal-hand command to reveal their hand as: {1}',
            player,
            player.hand
        );
    }

    removeFromGame(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to remove a card from the game',
            cardCondition: (card) =>
                card.controller === player &&
                card.owner === player &&
                !['active plot', 'out of game'].includes(card.location),
            cardType: ['attachment', 'character', 'event', 'location', 'plot'],
            onSelect: (p, card) => {
                player.removeCardFromGame(card);
                this.game.addAlert(
                    'danger',
                    '{0} uses the /remove-from-game command to remove {1} from the game',
                    player,
                    card
                );
                return true;
            }
        });
    }

    addCard(player, args) {
        let cardName = args.slice(1).join(' ');
        let card = Object.values(this.game.cardData).find((c) => {
            return (
                c.label.toLowerCase() === cardName.toLowerCase() ||
                c.name.toLowerCase() === cardName.toLowerCase()
            );
        });

        if (!card) {
            return false;
        }

        let deck = new Deck();
        let preparedCard = deck.createCard(player, card);

        preparedCard.applyAnyLocationPersistentEffects();

        if (deck.isDrawCard(card)) {
            player.moveCard(preparedCard, 'draw deck');
        } else if (deck.isPlotCard(card)) {
            player.moveCard(preparedCard, 'plot deck');
        }

        this.game.allCards.push(preparedCard);

        this.game.addAlert(
            'danger',
            '{0} uses the /add-card command to add {1} to their deck',
            player,
            card
        );

        return true;
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if (isNaN(num)) {
            num = defaultNumber;
        }

        if (num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidIcon(icon) {
        if (!icon) {
            return false;
        }

        var lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    isValidToken(token) {
        if (!token) {
            return false;
        }

        return Tokens.includes(token);
    }

    rematch(player) {
        if (this.game.isGameOver) {
            this.game.addAlert('info', '{0} is requesting a rematch', player);
        } else {
            this.game.addAlert(
                'danger',
                '{0} is requesting a rematch. The current game is not finished',
                player
            );
        }

        this.game.queueStep(new RematchPrompt(this.game, player));
    }

    muteSpectators(player) {
        this.game.muteSpectators = !this.game.muteSpectators;

        this.game.addAlert(
            'warning',
            '{0} {1}mutes spectators',
            player,
            this.game.muteSpectators ? '' : 'un'
        );
    }

    pauseClock(player) {
        this.game.pauseClock();

        this.game.addAlert(
            'danger',
            '{0} has {1}paused the clock',
            player,
            this.game.clockPaused ? '' : 'un'
        );
    }

    addChessClockTime(player, args) {
        var numberOfSeconds = this.getNumberOrDefault(args[1], 0);
        if (player) {
            player.addSecondsToClock(numberOfSeconds);

            this.game.addAlert(
                'danger',
                '{0} has added {1} seconds to his/her chess clock',
                player,
                numberOfSeconds
            );
        }
    }
}

export default ChatCommands;
