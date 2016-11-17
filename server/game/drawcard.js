const _ = require('underscore');

const BaseCard = require('./basecard.js');

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dupes = _([]);
        this.attachments = _([]);
        this.icons = {};

        if(cardData.is_military) {
            this.icons.military = true;
        }

        if(cardData.is_intrique) {
            this.icons.intrique = true;
        }

        if(cardData.is_power) {
            this.icons.power = true;
        }

        this.power = 0;
        this.strengthModifier = 0;
        this.kneeled = false;
    }

    addDuplicate(card) {
        this.dupes.push(card);
    }

    isLimited() {
        return this.hasKeyword('Limited');
    }

    isStealth() {
        return this.hasKeyword('Stealth');
    }

    isTerminal() {
        return this.hasKeyword('Terminal');
    }

    hasIcon(icon) {
        return this.icons[icon];
    }

    getCost() {
        return this.cardData.cost;
    }

    getStrength() {
        return this.strengthModifier + this.cardData.strength;
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        var baseSummary = super.getSummary(isActivePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            dupes: this.dupes.map(dupe => {
                return dupe.getSummary(isActivePlayer);
            }),
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(isActivePlayer);
            }),
            kneeled: this.kneeled,
            power: this.power,
            selected: isActivePlayer && this.selected
        });
    }
}

module.exports = DrawCard;
