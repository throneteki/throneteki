const PublicLocations = new Set(['dead pile', 'discard pile', 'out of game', 'play area']);
import DiscardCard from '../GameActions/DiscardCard.js';

class DropCommand {
    constructor(game, player, card, targetLocation) {
        this.game = game;
        this.player = player;
        this.card = card;
        this.originalLocation = card.location;
        this.targetLocation = targetLocation;
    }

    execute() {
        if (this.originalLocation === this.targetLocation || this.card.controller !== this.player) {
            return;
        }

        if (!this.isValidDropCombination()) {
            return;
        }

        if (this.targetLocation === 'play area') {
            this.player.putIntoPlay(this.card, 'play', { force: true });
        } else if (this.targetLocation === 'dead pile' && this.card.location === 'play area') {
            this.game.killCharacter(this.card, { allowSave: false, force: true });
        } else if (
            this.targetLocation === 'discard pile' &&
            DiscardCard.allow({ card: this.card, force: true })
        ) {
            this.player.discardCard(this.card, false, { force: true });
        } else {
            this.player.moveCard(this.card, this.targetLocation);
        }

        this.addGameMessage();
    }

    isValidDropCombination() {
        const PlotCardTypes = ['plot'];
        const DrawDeckCardTypes = ['attachment', 'character', 'event', 'location'];
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
            (PublicLocations.has(this.originalLocation) || PublicLocations.has(this.targetLocation))
        );
    }
}

export default DropCommand;
