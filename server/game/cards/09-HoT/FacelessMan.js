const DrawCard = require('../../drawcard.js');

class FacelessMan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain character\'s icons, keywords, factions and traits',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: card => card.location === 'dead pile' && card.getType() === 'character'
            },
            handler: context => {
                let copyObj = {
                    icons: context.target.getIcons(),
                    keywords: context.target.getPrintedKeywords(),
                    factions: context.target.getFactions(),
                    traits: context.target.getTraits()
                };

                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.gainIconsKeywordsFactionsTraits(copyObj)
                }));

                this.game.addMessage('{0} uses {1} to have {1} gain each of {2}\'s printed challenge icons, keywords, faction affiliations and traits',
                    context.player, this, context.target);
            }
        });
    }
}

FacelessMan.code = '09040';

module.exports = FacelessMan;
