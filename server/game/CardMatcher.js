const Matcher = require('./Matcher.js');

class CardMatcher {
    static isMatch(card, properties) {
        return (
            Matcher.containsValue(properties.type, () => card.getType()) &&
            Matcher.anyValue(properties.faction, faction => card.isFaction(faction)) &&
            Matcher.containsValue(properties.kneeled, () => card.kneeled) &&
            Matcher.containsValue(properties.location, () => card.location) &&
            Matcher.containsValue(properties.name, () => card.name) &&
            Matcher.anyValue(properties.trait, trait => card.hasTrait(trait)) &&
            Matcher.containsValue(properties.unique, () => card.isUnique()) &&
            Matcher.containsValue(properties.loyal, () => card.isLoyal()) &&
            Matcher.containsValue(properties.limited, () => card.isLimited && card.isLimited()) &&
            Matcher.anyValue(properties.printedCostOrLower, amount => card.hasPrintedCost() && card.getPrintedCost() <= amount) &&
            Matcher.anyValue(properties.printedCostOrHigher, amount => card.hasPrintedCost() && card.getPrintedCost() >= amount) &&
            Matcher.anyValue(properties.printedStrengthOrLower, amount => card.hasPrintedStrength() && card.getPrintedStrength() <= amount) &&
            Matcher.anyValue(properties.printedStrengthOrHigher, amount => card.hasPrintedStrength() && card.getPrintedStrength() >= amount) &&
            Matcher.anyValue(properties.shadow, isShadow => card.isShadow() === isShadow) &&
            Matcher.anyValue(properties.hasAttachments, hasAttachments => hasAttachments === (card.attachments.length > 0)) &&
            Matcher.anyValue(properties.attacking, attacking => card.isAttacking() === attacking) &&
            Matcher.anyValue(properties.defending, defending => card.isDefending() === defending) &&
            Matcher.anyValue(properties.participating, participating => card.isParticipating() === participating) &&
            Matcher.containsValue(properties.facedown, () => card.facedown) &&
            Matcher.containsValue(properties.parent, () => card.parent) &&
            Matcher.anyValue(properties.not, notProperties => !CardMatcher.isMatch(card, notProperties)) &&
            Matcher.anyValue(properties.or, orProperties => CardMatcher.isMatch(card, orProperties))
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
            case 'choosingPlayer':
                return card.controller === context.choosingPlayer;
        }

        return false;
    }

    /**
     * Creates a checker function to determine whether card characteristics are 
     * involved in a given matcher properties/func. Characteristics would be 
     * information about the card itself (eg. name, type, strength, icons, etc.) rather 
     * than information about the cards game-state (eg. location, kneeling, controller, etc.)
     */
    static createCardCharacteristicChecker(propertiesOrFunc) {
        let dummyMatcher = CardMatcher.createMatcher(propertiesOrFunc);
        let characteristics = ['name', 'factions', 'icons', 'keywords', 'traits', 'cardData'];

        return function(card, context) {
            let involvesCharacteristic = false;
            let proxy = new Proxy(card, {
                // Wraps the getter of each property to check if a characteristic is accessed
                get(object, property) {
                    if(characteristics.includes(property)) {
                        involvesCharacteristic = true;
                    }
                    return object[property];
                }
            });
            
            // Run the proxy test through the matcher
            dummyMatcher(proxy, context);

            return involvesCharacteristic;
        };
    }
}

module.exports = CardMatcher;
