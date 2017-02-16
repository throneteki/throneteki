const Costs = {
    /**
     * Cost that will kneel the card that initiated the ability.
     */
    kneelSelf: function() {
        return {
            canPay: function(context) {
                return !context.source.kneeled;
            },
            pay: function(context) {
                context.source.controller.kneelCard(context.source);
            }
        };
    },
    /**
     * Cost that will kneel the player's faction card.
     */
    kneelFactionCard: function() {
        return {
            canPay: function(context) {
                return !context.player.faction.kneeled;
            },
            pay: function(context) {
                context.player.kneelCard(context.player.faction);
            }
        };
    }
    // kneel: function(condition) {
    //     return {
    //         canPay: function(context) {
    //             return new Promise(function(resolve) {
    //                 context.game.promptForSelect(context.player, {
    //                     cardCondition: card => card.controller === context.player && condition(card),
    //                     activePromptTitle: 'Select card to kneel',
    //                     waitingPromptTitle: 'Waiting for opponent to use ' + context.source.name,
    //                     onSelect: (player, card) => {
    //                         context.kneelingCostCard = card;
    //                         resolve(true);
    //                     },
    //                     onCancel: () => {
    //                         resolve(false);
    //                     }
    //                 });
    //             });
    //         },
    //         pay: function(context) {
    //             context.player.kneelCard(context.kneelingCostCard);
    //         }
    //     };
    // }
};

module.exports = Costs;
