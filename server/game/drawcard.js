const _ = require('underscore');

const BaseCard = require('./basecard.js');
const SetupCardAction = require('./setupcardaction.js');
const MarshalCardAction = require('./marshalcardaction.js');
const AmbushCardAction = require('./ambushcardaction.js');

const StandardPlayActions = [
    new SetupCardAction(),
    new MarshalCardAction(),
    new AmbushCardAction()
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dupes = _([]);
        this.attachments = _([]);
        this.icons = {
            military: 0,
            intrigue: 0,
            power: 0
        };

        if(cardData.is_military) {
            this.icons.military++;
        }

        if(cardData.is_intrigue) {
            this.icons.intrigue++;
        }

        if(cardData.is_power) {
            this.icons.power++;
        }

        this.power = 0;
        this.strengthModifier = 0;
        this.strengthMultiplier = 1;
        this.strengthSet = undefined;
        this.dominanceStrengthModifier = 0;
        this.contributesToDominance = true;
        this.kneeled = false;
        this.inChallenge = false;
        this.inDanger = false;
        this.wasAmbush = false;
        this.saved = false;
        this.challengeOptions = {
            doesNotContributeStrength: false,
            doesNotKneelAs: {
                attacker: false,
                defender: false
            },
            mustBeDeclaredAsDefender: false
        };
        this.stealthLimit = 1;
        this.minCost = 0;
    }

    canBeDuplicated() {
        return this.controller === this.owner;
    }

    addDuplicate(card) {
        if(!this.canBeDuplicated()) {
            return;
        }

        this.dupes.push(card);
        card.moveTo('duplicate');
    }

    removeDuplicate(force = false) {
        var firstDupe = undefined;

        if(!force) {
            firstDupe = _.first(this.dupes.filter(dupe => {
                return dupe.owner === this.controller;
            }));
        } else {
            firstDupe = this.dupes.first();
        }

        this.dupes = _(this.dupes.reject(dupe => {
            return dupe === firstDupe;
        }));

        return firstDupe;
    }

    isLimited() {
        return this.hasKeyword('Limited') || this.hasPrintedKeyword('Limited');
    }

    isStealth() {
        return this.hasKeyword('Stealth');
    }

    isTerminal() {
        return this.hasKeyword('Terminal');
    }

    isAmbush() {
        return !_.isUndefined(this.ambushCost);
    }

    isBestow() {
        return !_.isUndefined(this.bestowMax);
    }

    isRenown() {
        return this.hasKeyword('renown');
    }

    hasIcon(icon) {
        return this.icons[icon.toLowerCase()] > 0;
    }

    getPrintedCost() {
        return this.cardData.cost || 0;
    }

    getCost() {
        return this.getPrintedCost();
    }

    getMinCost() {
        return this.minCost;
    }

    getAmbushCost() {
        return this.ambushCost;
    }

    getPower() {
        return this.power;
    }

    modifyStrength(amount, applying = true) {
        this.strengthModifier += amount;
        this.game.raiseMergedEvent('onCardStrengthChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    modifyStrengthMultiplier(amount, applying = true) {
        let strengthBefore = this.getStrength();

        this.strengthMultiplier *= amount;
        this.game.raiseMergedEvent('onCardStrengthChanged', {
            card: this,
            amount: this.getStrength() - strengthBefore,
            applying: applying
        });
    }

    getPrintedStrength() {
        return (this.cardData.strength || 0);
    }

    getStrength() {
        let baseStrength = this.getPrintedStrength();

        if(this.controller.phase === 'setup') {
            return baseStrength;
        }

        if(_.isNumber(this.strengthSet)) {
            return this.strengthSet;
        }

        let modifiedStrength = this.strengthModifier + baseStrength;
        let multipliedStrength = Math.round(this.strengthMultiplier * modifiedStrength);
        return Math.max(0, multipliedStrength);
    }

    modifyDominanceStrength(amount) {
        this.dominanceStrengthModifier += amount;
    }

    getDominanceStrength() {
        let baseStrength = !this.kneeled && this.getType() === 'character' && this.contributesToDominance ? this.getStrength() : 0;

        return Math.max(0, baseStrength + this.dominanceStrengthModifier);
    }

    getIconsAdded() {
        var icons = [];

        if(this.hasIcon('military') && !this.cardData.is_military) {
            icons.push('military');
        }

        if(this.hasIcon('intrigue') && !this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(this.hasIcon('power') && !this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    getIconsRemoved() {
        var icons = [];

        if(!this.hasIcon('military') && this.cardData.is_military) {
            icons.push('military');
        }

        if(!this.hasIcon('intrigue') && this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(!this.hasIcon('power') && this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    getNumberOfIcons() {
        let count = 0;

        if(this.hasIcon('military')) {
            count += 1;
        }
        if(this.hasIcon('intrigue')) {
            count += 1;
        }
        if(this.hasIcon('power')) {
            count += 1;
        }

        return count;
    }

    addIcon(icon) {
        this.icons[icon]++;
    }

    removeIcon(icon) {
        this.icons[icon]--;
    }

    modifyPower(power) {
        this.game.applyGameAction('gainPower', this, card => {
            let oldPower = card.power;

            card.power += power;

            if(card.power < 0) {
                card.power = 0;
            }

            this.game.raiseEvent('onCardPowerChanged', this, card.power - oldPower);

            this.game.checkWinCondition(this.controller);
        });
    }

    needsStealthTarget() {
        return this.isStealth() && !this.stealthTarget;
    }

    canUseStealthToBypass(targetCard) {
        return this.isStealth() && targetCard.canBeBypassedByStealth();
    }

    useStealthToBypass(targetCard) {
        if(!this.canUseStealthToBypass(targetCard)) {
            return false;
        }

        targetCard.stealth = true;
        this.stealthTarget = targetCard;

        return true;
    }

    clearBlank() {
        super.clearBlank();
        this.attachments.each(attachment => {
            if(!this.allowAttachment(attachment)) {
                this.controller.discardCard(attachment, false);
            }
        });
    }

    allowAttachment(attachment) {
        return (
            this.isBlank() ||
            this.allowedAttachmentTrait === 'any' ||
            this.allowedAttachmentTrait !== 'none' && attachment.hasTrait(this.allowedAttachmentTrait)
        );
    }

    canAttach(player, card) {
        if(this.getType() !== 'attachment') {
            return false;
        }

        return card.allowAttachment(this);
    }

    removeAttachment(attachment) {
        if(!attachment || !this.attachments.includes(attachment)) {
            return;
        }

        this.attachments = _(this.attachments.reject(a => a === attachment));
        attachment.parent = undefined;
    }

    getPlayActions() {
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(_.filter(this.abilities.actions, action => !action.allowMenu()));
    }

    leavesPlay() {
        this.kneeled = false;
        this.power = 0;
        this.wasAmbush = false;
        this.inChallenge = false;

        super.leavesPlay();
    }

    resetForChallenge() {
        this.stealth = false;
        this.stealthTarget = undefined;
        this.inChallenge = false;
    }

    canDeclareAsAttacker(challengeType) {
        return this.allowGameAction('declareAsAttacker') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsDefender(challengeType) {
        return this.allowGameAction('declareAsDefender') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsParticipant(challengeType) {
        return (
            this.canParticipateInChallenge() &&
            this.location === 'play area' &&
            !this.stealth &&
            (!this.kneeled || this.challengeOptions.canBeDeclaredWhileKneeling) &&
            (this.hasIcon(challengeType) || this.challengeOptions.canBeDeclaredWithoutIcon)
        );
    }

    canParticipateInChallenge() {
        return this.getType() === 'character'
            && this.allowGameAction('participateInChallenge');
    }

    canBeBypassedByStealth() {
        return !this.isStealth() && this.allowGameAction('bypassByStealth');
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBeMarshaled() {
        return this.allowGameAction('marshal');
    }

    canBePlayed() {
        return this.allowGameAction('play');
    }

    markAsInDanger() {
        this.inDanger = true;
    }

    markAsSaved() {
        this.inDanger = false;
        this.saved = true;
    }

    clearDanger() {
        this.inDanger = false;
        this.saved = false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            baseStrength: this.getPrintedStrength(),
            dupes: this.dupes.map(dupe => {
                if(dupe.dupes.size() !== 0) {
                    throw new Error('A dupe should not have dupes! ' + dupe.name);
                }

                return dupe.getSummary(activePlayer, hideWhenFaceup);
            }),
            iconsAdded: this.getIconsAdded(),
            iconsRemoved: this.getIconsRemoved(),
            inChallenge: this.inChallenge,
            inDanger: this.inDanger,
            kneeled: this.kneeled,
            power: this.power,
            saved: this.saved,
            strength: this.getStrength(),
            stealth: this.stealth
        });
    }
}

module.exports = DrawCard;
