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
            Matcher.containsValue(properties.unique, card.isUnique())
        );
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
