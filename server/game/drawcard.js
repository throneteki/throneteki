import BaseCard from './basecard.js';
import CardMatcher from './CardMatcher.js';
import ReferenceCountedSetProperty from './PropertyTypes/ReferenceCountedSetProperty.js';
import StandardPlayActions from './PlayActions/StandardActions.js';
import CardStat from './cardStat.js';
import { Flags } from './Constants/index.js';

const Icons = ['military', 'intrigue', 'power'];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dupes = [];
        this.attachments = [];
        this.childCards = [];
        this.strength = new CardStat(this.getPrintedStrength());
        this.dominanceStrengthModifier = 0;
        this.kneeled = false;
        this.inChallenge = false;
        this.isContributing = false;
        this.inDanger = false;
        this.saved = false;
        this.minCost = 0;
        this.eventPlacementLocation = 'discard pile';
    }

    createSnapshot() {
        let clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = this.attachments.map((attachment) => attachment.createSnapshot());
        clone.childCards = this.childCards.map((card) => card.createSnapshot());
        clone.controllerStack = [...this.controllerStack];
        clone.dupes = this.dupes.map((dupe) => dupe.createSnapshot());
        clone.factions = this.factions.clone();
        clone.flags = this.flags.clone();
        clone.icons = this.icons.clone();
        clone.location = this.location;
        clone.keywords = this.keywords.clone();
        clone.kneeled = this.kneeled;
        clone.parent = this.parent;
        clone.power = this.power;
        clone.strength = this.strength.clone();
        clone.tokens = Object.assign({}, this.tokens);
        clone.traits = this.traits.clone();

        return clone;
    }

    setupCardTextProperties(ability) {
        super.setupCardTextProperties(ability);

        this.icons = new ReferenceCountedSetProperty();

        for (let icon of this.getPrintedIcons()) {
            this.icons.add(icon);
        }

        this.setupDuplicateAbility(ability);
    }

    setupDuplicateAbility(ability) {
        let dupeCondition = (event) =>
            event.card === this.parent &&
            this.parent.canBeSaved() &&
            event.allowSave &&
            (this.controller.promptDupes || this.parent.controller !== this.controller);

        this.interrupt({
            abilitySourceType: 'game',
            canCancel: true,
            cannotBeCanceled: true,
            ignoreEventCosts: true,
            location: 'duplicate',
            when: {
                onCharacterKilled: dupeCondition,
                onCardDiscarded: dupeCondition,
                onCardReturnedToHand: dupeCondition,
                onCardRemovedFromGame: dupeCondition,
                onCardReturnedToDeck: dupeCondition,
                onCardPutIntoShadows: dupeCondition
            },
            cost: ability.costs.discardDuplicate(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} discards a duplicate to save {1}',
                    this.owner,
                    context.cardStateWhenInitiated.parent
                );
            }
        });
    }

    canBeDuplicated() {
        return this.controller === this.owner;
    }

    addDuplicate(card) {
        if (!this.canBeDuplicated()) {
            return;
        }

        //first move the card to the duplicate area, then push it to the dupes array
        //this is necessary for A Mummer´s Farce
        //this allows a facedown character card attached to a unique character to be marshalled as a dupe to the character
        //pushing it to the dupes array first will lead to the dupe being removed in card.moveTo
        card.moveTo('duplicate', this);
        this.dupes.push(card);
    }

    removeDuplicate(force = false) {
        var firstDupe = undefined;

        if (!force) {
            firstDupe = this.dupes.filter((dupe) => {
                return dupe.owner === this.controller;
            })[0];
        } else {
            firstDupe = this.dupes[0];
        }

        this.dupes = this.dupes.filter((dupe) => {
            return dupe !== firstDupe;
        });

        return firstDupe;
    }

    isShadow() {
        return this.keywords.getShadowCost() !== undefined;
    }

    isLimited() {
        return (
            this.hasKeyword('limited') || (!this.isAnyBlank() && this.hasPrintedKeyword('limited'))
        );
    }

    isStealth() {
        return this.hasKeyword('Stealth');
    }

    isAssault() {
        return this.hasKeyword('Assault');
    }

    isTerminal() {
        return this.hasKeyword('Terminal');
    }

    isAmbush() {
        return this.keywords.getAmbushCost() !== undefined;
    }

    isBestow() {
        return this.keywords.getBestowMax() !== undefined;
    }

    isRenown() {
        return this.hasKeyword('renown');
    }

    hasIcon(icon) {
        return this.icons.contains(icon);
    }

    hasPrintedCost() {
        return !this.facedown && this.cardData.cost !== '-';
    }

    getPrintedCost() {
        return this.getPrintedNumberFor(this.cardData.cost);
    }

    getCost() {
        return this.cardData.cost;
    }

    getMinCost() {
        return this.minCost;
    }

    getAmbushCost() {
        return this.keywords.getAmbushCost();
    }

    getBestowMax() {
        return this.keywords.getBestowMax();
    }

    getShadowCost() {
        return this.keywords.getShadowCost();
    }

    getShadowPosition() {
        return this.location === 'shadows' ? this.controller.shadows.indexOf(this) + 1 : null;
    }

    get strengthSet() {
        return this.strength.setValue;
    }

    setStrength(effect, newStrength, applying = true) {
        let strengthBefore = this.getStrength();
        this.strength.addSetValue(effect, newStrength);
        let changedAmount = this.getStrength() - strengthBefore;

        this.raiseStrengthChangeEvent(changedAmount, applying);
    }

    removeSetStrengthEffect(effect, applying = false) {
        let strengthBefore = this.getStrength();
        this.strength.removeSetValue(effect);
        let changedAmount = this.getStrength() - strengthBefore;

        //TODO
        //Prior to the rework of card stats, a burn check was not carried out on expiration of a set strength effect
        //most relevant cases were caught by a burn check at the end of a challenge
        //adding this exposes an issue with simultaneous effects when Blood of the Dragon and At the Palace of Sorrows expire
        //keep this commented out to maintain previous functionality until a more thorough fix for simultaneous strength changes from multiple cards
        //is implemented.
        //this.raiseStrengthChangeEvent(changedAmount, applying);
    }

    addStrengthModifier(effect, amount, applying = true) {
        let strengthBefore = this.getStrength();
        this.strength.addModifier(effect, amount);
        let changedAmount = this.getStrength() - strengthBefore;

        if (this.strengthSet === null) {
            this.raiseStrengthChangeEvent(changedAmount, applying);
        }
    }

    changeStrengthModifier(effect, amount, applying = true) {
        let strengthBefore = this.getStrength();
        this.strength.changeModifier(effect, amount);
        let changedAmount = this.getStrength() - strengthBefore;

        if (this.strengthSet === null) {
            this.raiseStrengthChangeEvent(changedAmount, applying);
        }
    }

    removeStrengthModifier(effect, applying = false) {
        let strengthBefore = this.getStrength();
        this.strength.removeModifier(effect);
        let changedAmount = this.getStrength() - strengthBefore;

        if (this.strengthSet === null) {
            this.raiseStrengthChangeEvent(changedAmount, applying);
        }
    }

    modifyStrengthMultiplier(effect, amount, applying = true) {
        let strengthBefore = this.getStrength();
        this.strength.addMultiplier(effect, amount);
        let changedAmount = this.getStrength() - strengthBefore;
        if (this.strengthSet === null) {
            this.raiseStrengthChangeEvent(changedAmount, applying);
        }
    }

    removeStrengthMultiplier(effect, applying = false) {
        let strengthBefore = this.getStrength();
        this.strength.removeMultiplier(effect);

        let changedAmount = this.getStrength() - strengthBefore;
        if (this.strengthSet === null) {
            this.raiseStrengthChangeEvent(changedAmount, applying);
        }
    }

    raiseStrengthChangeEvent(amount, applying) {
        let params = {
            card: this,
            amount: amount,
            applying: applying
        };
        this.game.raiseEvent('onCardStrengthChanged', params, () => {
            if (this.isBurning && this.getStrength() <= 0) {
                this.game.killCharacter(this, { allowSave: false, isBurn: true });
            }
        });
    }

    getPrintedStrength() {
        return this.getPrintedNumberFor(this.cardData.strength);
    }

    hasPrintedStrength() {
        return !this.facedown && this.getType() === 'character';
    }

    getStrength() {
        return this.getBoostedStrength(0);
    }

    getBoostedStrength(boostValue) {
        let baseStrength = this.getPrintedStrength();

        if (this.game.currentPhase === 'setup') {
            return baseStrength;
        }

        return this.strength.calculate(boostValue);
    }

    modifyDominanceStrength(amount) {
        this.dominanceStrengthModifier += amount;
    }

    getDominanceStrength() {
        let baseStrength =
            this.getType() === 'character' &&
            (!this.kneeled || this.hasFlag(Flags.dominanceOptions.contributesWhileKneeling)) &&
            !this.hasFlag(Flags.dominanceOptions.doesNotContribute)
                ? this.getStrength()
                : 0;

        return Math.max(0, baseStrength + this.dominanceStrengthModifier);
    }

    getIcons() {
        return this.icons.getValues();
    }

    getPrintedIcons() {
        if (!this.cardData.icons) {
            return [];
        }

        return Icons.filter((icon) => !!this.cardData.icons[icon]);
    }

    getIconsAdded() {
        let icons = this.getIcons();
        let printedIcons = this.getPrintedIcons();
        return icons.filter((icon) => !printedIcons.includes(icon));
    }

    getIconsRemoved() {
        let icons = this.getIcons();
        let printedIcons = this.getPrintedIcons();
        return printedIcons.filter((icon) => !icons.includes(icon));
    }

    getNumberOfIcons() {
        return this.icons.size();
    }

    addIcon(icon) {
        this.icons.add(icon);
    }

    removeIcon(icon) {
        this.icons.remove(icon);
    }

    /**
     * Defines restrictions on what cards this attachment can be placed on.
     */
    attachmentRestriction(...restrictions) {
        // TODO: Re-work printed attachmentRestrictions to apply as a persistent effect, rather than manually (similar to keywords, and must account for facedown).
        this.attachmentRestrictions = restrictions.map((restriction) => {
            if (typeof restriction === 'function') {
                return restriction;
            }

            return CardMatcher.createAttachmentMatcher(restriction);
        });
    }

    addAdditionalAttachmentRestriction(restriction) {
        this.additionalAttachmentRestrictions = this.additionalAttachmentRestrictions || [];
        this.additionalAttachmentRestrictions.push(restriction);
    }

    removeAdditionalAttachmentRestriction(restriction) {
        if (this.additionalAttachmentRestrictions) {
            this.additionalAttachmentRestrictions = this.additionalAttachmentRestrictions.filter(
                (r) => r !== restriction
            );
        }
    }

    getAttachmentRestrictions() {
        if (!(this.attachmentRestrictions || this.additionalAttachmentRestrictions)) {
            return undefined;
        }
        let restrictions =
            (this.isAnyBlank() || this.facedown ? undefined : this.attachmentRestrictions) || [];
        let additional = this.additionalAttachmentRestrictions || [];

        restrictions = restrictions.concat(additional);

        return restrictions.length > 0 ? restrictions : undefined;
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment) {
        let requiredTraits = this.keywords.getRequiredAttachmentTraits();

        if (requiredTraits.length === 0) {
            return true;
        }

        return requiredTraits.every((trait) => attachment.hasTrait(trait));
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(player, card) {
        if (this.getType() !== 'attachment' || !card) {
            return false;
        }

        let attachmentRestrictions = this.getAttachmentRestrictions();

        if (!attachmentRestrictions) {
            return card.getType() === 'character';
        }

        let context = { player: player };

        return attachmentRestrictions.some((restriction) => restriction(card, context));
    }

    addChildCard(card, location) {
        this.childCards.push(card);
        card.moveTo(location, this);
    }

    removeChildCard(card) {
        if (!card) {
            return;
        }

        this.attachments = this.attachments.filter((a) => a !== card);
        this.dupes = this.dupes.filter((a) => a !== card);
        this.childCards = this.childCards.filter((a) => a !== card);
    }

    get underneath() {
        return this.childCards.filter((childCard) => childCard.location === 'underneath');
    }

    getPlayActions() {
        return StandardPlayActions.concat(this.abilities.playActions).concat(
            this.abilities.actions.filter((action) => !action.allowMenu())
        );
    }

    leavesPlay() {
        this.kneeled = false;
        this.new = false;
        this.clearDanger();
        this.resetForChallenge();

        super.leavesPlay();
    }

    resetForChallenge() {
        this.bypassedByStealth = false;
        this.targetedByAssault = false;
        this.inChallenge = false;
        this.isContributing = false;
    }

    kneelsAsAttacker(challengeType) {
        const flags = [
            Flags.challengeOptions.doesNotKneelAsAttacker('any'),
            Flags.challengeOptions.doesNotKneelAsAttacker(challengeType)
        ];

        return flags.every((flag) => !this.hasFlag(flag));
    }

    kneelsAsDefender(challengeType) {
        const flags = [
            Flags.challengeOptions.doesNotKneelAsDefender('any'),
            Flags.challengeOptions.doesNotKneelAsDefender(challengeType)
        ];

        return flags.every((flag) => !this.hasFlag(flag));
    }

    canParticipate({ attacking, challengeType }) {
        return (
            this.getType() === 'character' &&
            this.canDeclareAsParticipant({ attacking, challengeType }) &&
            this.allowGameAction(attacking ? 'declareAsAttacker' : 'declareAsDefender') &&
            !this.isParticipating()
        );
    }

    canDeclareAsParticipant({ attacking, challengeType }) {
        let canKneelForChallenge =
            (attacking && !this.kneeled && !this.kneelsAsAttacker(challengeType)) ||
            (!attacking && !this.kneeled && !this.kneelsAsDefender(challengeType)) ||
            (!this.kneeled && this.allowGameAction('kneel')) ||
            (this.kneeled && this.hasFlag(Flags.challengeOptions.canBeDeclaredWhileKneeling));

        return (
            this.canParticipateInChallenge() &&
            this.location === 'play area' &&
            canKneelForChallenge &&
            (this.hasIcon(challengeType) ||
                this.hasFlag(Flags.challengeOptions.canBeDeclaredWithoutIcon))
        );
    }

    canParticipateInChallenge() {
        return this.getType() === 'character' && this.allowGameAction('participateInChallenge');
    }

    canBeKneeled() {
        return this.allowGameAction('kneel');
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBeDiscarded() {
        return this.allowGameAction('discard');
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

    setIsBurning(burning) {
        this.isBurning = burning;
        //register/unregister onChallengeFinished event so when the challenge is finished
        //the burn effect gets evaluated again
        if (burning) {
            this.events.register(['onChallengeFinished']);
        } else {
            this.events.unregisterHandlerForEventName('onChallengeFinished');
        }
    }

    //evaluate the burn effect again when the challenge is finished
    onChallengeFinished() {
        if (this.isBurning && this.getStrength() <= 0) {
            this.game.killCharacter(this, { allowSave: false, isBurn: true });
        }
    }

    getSummary(activePlayer) {
        let baseSummary = super.getSummary(activePlayer);

        let publicSummary = {
            attached: !!this.parent,
            attachments: this.attachments.map((attachment) => {
                return attachment.getSummary(activePlayer);
            }),
            childCards: this.childCards.map((card) => {
                return card.getSummary(activePlayer);
            }),
            dupes: this.dupes.map((dupe) => {
                if (dupe.dupes.length !== 0) {
                    throw new Error('A dupe should not have dupes! ' + dupe.name);
                }

                return dupe.getSummary(activePlayer);
            }),
            kneeled: this.kneeled
        };

        if (baseSummary.facedown) {
            return Object.assign(baseSummary, publicSummary);
        }

        return Object.assign(baseSummary, publicSummary, {
            baseStrength: this.cardData.strength,
            iconsAdded: this.getIconsAdded(),
            iconsRemoved: this.getIconsRemoved(),
            inChallenge: this.inChallenge,
            isContributing: this.isContributing,
            inDanger: this.inDanger,
            saved: this.saved,
            strength: this.getStrength(),
            stealth: this.bypassedByStealth,
            assault: this.targetedByAssault
        });
    }
}

export default DrawCard;
