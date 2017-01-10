const Effects = {
    modifyStrength: function(value) {
        return {
            apply: function(card) {
                card.strengthModifier += value;
            },
            unapply: function(card) {
                card.strengthModifier -= value;
            }
        };
    },
    addIcon: function(icon) {
        return {
            apply: function(card) {
                card.setIcon(icon);
            },
            unapply: function(card) {
                card.clearIcon(card);
            }
        };
    },
    addKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                card.removeKeyword(keyword);
            }
        };
    },
    poison: function() {
        return {
            apply: function(card, context) {
                context.game.addMessage('{0} uses {1} to place 1 poison token on {2}', context.source.controller, context.source, card);
                card.addToken('poison', 1);
            },
            unapply: function(card, context) {
                if(card.hasToken('poison', 1)) {
                    context.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', context.source.controller, context.source, card);
                    card.removeToken('poison');
                    card.controller.killCharacter(card);
                }
            }
        };
    },
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    }
};

module.exports = Effects;
