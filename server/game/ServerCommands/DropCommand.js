import DiscardCard from '../GameActions/DiscardCard.js';
import { OpenInformationLocations } from '../CardVisibility.js';
import RevealPlots from '../gamesteps/revealplots.js';
import GameActions from '../GameActions/index.js';

const DrawDeckCardTypes = ['attachment', 'character', 'event', 'location'];

class DropCommand {
    constructor(game, player, card, targetLocation, parentCard) {
        this.game = game;
        this.player = player;
        this.card = card;
        this.originalLocation = card.location;
        this.targetLocation = targetLocation;
        this.parentCard = parentCard;
    }

    execute() {
        // An attachment waiting for its target is already on its way into play
        if (this.game.pendingAttachments?.has(this.card)) {
            return false;
        }

        if (this.isPlotPlacement()) {
            return this.promptPlotPlacement();
        }

        if (this.targetLocation === 'underneath') {
            return this.placeUnderneath();
        }

        if (this.originalLocation === this.targetLocation || this.card.controller !== this.player) {
            return false;
        }

        if (!this.isValidDropCombination()) {
            return false;
        }

        if (this.targetLocation === 'play area') {
            const playingType = this.game.currentPhase === 'setup' ? 'setup' : 'play';
            this.player.putIntoPlay(this.card, playingType, { force: true });
        } else if (this.targetLocation === 'dead pile' && this.card.location === 'play area') {
            this.game.killCharacter(this.card, { allowSave: false, force: true });
        } else if (
            this.targetLocation === 'discard pile' &&
            DiscardCard.allow({ card: this.card, force: true })
        ) {
            this.player.discardCard(this.card, false, { force: true });
        } else if (this.targetLocation === 'agenda') {
            this.player.removeCardFromPile(this.card);
            this.player.agenda.addChildCard(this.card, 'underneath');
            this.card.facedown = 'true';
        } else {
            this.player.moveCard(this.card, this.targetLocation);
        }

        this.addGameMessage();

        return true;
    }

    isPlotPlacement() {
        return (
            this.card.controller === this.player &&
            this.card.getType() === 'plot' &&
            this.targetLocation === 'revealed plots' &&
            ['plot deck', 'revealed plots'].includes(this.originalLocation)
        );
    }

    /**
     * A plot dropped on the used plots pile is either put with the used plots or revealed on the
     * spot, so the player is asked. Nothing is moved or recorded until they choose.
     */
    promptPlotPlacement() {
        const handlers = {
            cancel: () => true,
            reveal: () => {
                this.game.addAlert(
                    'danger',
                    '{0} has revealed {1} immediately',
                    this.player,
                    this.card
                );
                this.record(this.originalLocation, 'active plot');
                this.game.queueStep(new RevealPlots(this.game, [this.card]));
                return true;
            }
        };
        const buttons = [{ text: 'Reveal now', method: 'reveal' }];

        if (this.originalLocation === 'plot deck') {
            handlers.move = () => {
                this.player.moveCard(this.card, this.targetLocation);
                this.addGameMessage();
                this.record(this.originalLocation, this.targetLocation);
                return true;
            };
            buttons.unshift({ text: 'Move to used plots', method: 'move' });
        }

        this.game.promptWithMenu(this.player, handlers, {
            activePrompt: {
                menuTitle: 'Place this plot',
                buttons: [...buttons, { text: 'Cancel', method: 'cancel', cancel: true }]
            },
            source: this.card,
            beforeInitiation: true
        });

        return false;
    }

    canPlaceUnderneath() {
        const parent = this.parentCard;
        return (
            !!parent &&
            parent !== this.card &&
            parent.parent !== this.card &&
            parent.location === 'play area' &&
            this.card.controller === this.player &&
            DrawDeckCardTypes.includes(this.card.getType()) &&
            !parent.underneath.includes(this.card)
        );
    }

    placeUnderneath() {
        if (!this.canPlaceUnderneath()) {
            return false;
        }

        const visible = OpenInformationLocations.includes(this.originalLocation);
        this.game.resolveGameAction(
            GameActions.placeCardUnderneath({
                card: this.card,
                parentCard: this.parentCard,
                player: this.player,
                facedown: true
            })
        );
        this.game.addAlert(
            'danger',
            '{0} has placed {1} from their {2} facedown underneath {3}',
            this.player,
            visible ? this.card : 'a card',
            this.originalLocation,
            this.parentCard
        );

        return true;
    }

    record(from, to) {
        this.game.manualActions.record(this.player, 'drop', {
            cards: [this.card],
            args: [from, to]
        });
    }

    isValidDropCombination() {
        const PlotCardTypes = ['plot'];
        const AllowedTypesForPile = {
            'active plot': PlotCardTypes,
            'being played': ['event'],
            'dead pile': ['character'],
            'discard pile': DrawDeckCardTypes,
            'draw deck': DrawDeckCardTypes,
            hand: DrawDeckCardTypes,
            'out of game': DrawDeckCardTypes.concat(PlotCardTypes),
            'play area': ['attachment', 'character', 'location'],
            'plot deck': PlotCardTypes,
            'revealed plots': PlotCardTypes,
            shadows: DrawDeckCardTypes,
            agenda: DrawDeckCardTypes
        };

        let allowedTypes = AllowedTypesForPile[this.targetLocation];

        if (!allowedTypes) {
            return false;
        }

        return allowedTypes.includes(this.card.getType());
    }

    addGameMessage() {
        let movedCard = this.isPublicMove() ? this.card : 'a card';
        this.game.addAlert(
            'danger',
            '{0} has moved {1} from their {2} to their {3}',
            this.player,
            movedCard,
            this.originalLocation,
            this.targetLocation
        );
    }

    isPublicMove() {
        return (
            this.game.currentPhase !== 'setup' &&
            (OpenInformationLocations.includes(this.originalLocation) ||
                OpenInformationLocations.includes(this.targetLocation))
        );
    }
}

export default DropCommand;
