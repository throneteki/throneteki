const Matcher = require('./Matcher.js');

class CardMatcher {
    static isMatch(card, properties) {
        return (
            Matcher.containsValue(properties.type, card.getType()) &&
            Matcher.anyValue(properties.faction, faction => card.isFaction(faction)) &&
            Matcher.containsValue(properties.kneeled, card.kneeled) &&
            Matcher.containsValue(properties.location, card.location) &&
            Matcher.containsValue(properties.name, card.name) &&
            Matcher.anyValue(properties.trait, trait => card.hasTrait(trait)) &&
            Matcher.containsValue(properties.unique, card.isUnique()) &&
            Matcher.containsValue(properties.loyal, card.isLoyal()) &&
            Matcher.containsValue(properties.limited, card.isLimited()) &&
            Matcher.anyValue(properties.printedCostOrLower, amount => card.hasPrintedCost() && card.getPrintedCost() <= amount) &&
            Matcher.anyValue(properties.printedCostOrHigher, amount => card.hasPrintedCost() && card.getPrintedCost() >= amount) &&
            Matcher.anyValue(properties.printedStrengthOrLower, amount => card.hasPrintedStrength() && card.getPrintedStrength() <= amount) &&
            Matcher.anyValue(properties.printedStrengthOrHigher, amount => card.hasPrintedStrength() && card.getPrintedStrength() >= amount) &&
            Matcher.anyValue(properties.shadow, isShadow => card.isShadow() === isShadow) &&
            Matcher.anyValue(properties.hasAttachments, hasAttachments => hasAttachments === (card.attachments.length > 0)) &&
            Matcher.anyValue(properties.attacking, attacking => card.isAttacking() === attacking) &&
            Matcher.anyValue(properties.defending, defending => card.isDefending() === defending) &&
            Matcher.anyValue(properties.participating, participating => card.isParticipating() === participating) &&
            Matcher.containsValue(properties.facedown, card.facedown) &&
            Matcher.containsValue(properties.parent, card.parent) &&
            Matcher.anyValue(properties.not, notProperties => !CardMatcher.isMatch(card, notProperties))
        );
    }

    static createMatcher(propertiesOrFunc) {
        if(typeof(propertiesOrFunc) === 'function') {
            return propertiesOrFunc;
        }

        return function(card, context) {
            return (
                CardMatcher.isMatch(card, propertiesOrFunc) &&
                Matcher.anyValue(propertiesOrFunc.controller, controller => card.controller === controller || CardMatcher.attachmentControllerMatches(controller, card, context)) &&
                Matcher.anyValue(propertiesOrFunc.condition, condition => condition(card, context))
            );
        };
    }

    /**
     * Creates a matcher function to determine whether an attachment can be
     * attached to a particular card based on the properties passed. It defaults
     * to only allowing attachments on characters.
     */
    static createAttachmentMatcher(properties) {
        let defaultedProperties = Object.assign({ type: 'character' }, properties);
        return function(card, context) {
            return (
                CardMatcher.isMatch(card, defaultedProperties) &&
                Matcher.anyValue(properties.controller, controller => card.controller === controller || CardMatcher.attachmentControllerMatches(controller, card, context))
            );
        };
    }

    static attachmentControllerMatches(controllerProp, card, context) {
        switch(controllerProp) {
            case 'any':
                return true;
            case 'current':
                return card.controller === context.player;
            case 'opponent':
                return card.controller !== context.player;
        }

        return false;
    }
}

module.exports = CardMatcher;
