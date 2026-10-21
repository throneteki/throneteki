import DrawCard from '../../drawcard.js';
import { flatten } from '../../../Array.js';

class FacelessMan extends DrawCard {
    // Faceless Man (09040)
    // Ambush (4).
    // Challenges Action: Choose a character in a dead pile. Until the end of the phase, Faceless
    // Man gains each of that character's printed challenge icons, keywords, faction affiliations,
    // and Traits. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: "Gain character's icons, keywords, factions and traits",
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'dead pile' && card.getType() === 'character'
            },
            handler: (context) => {
                let effectArr = flatten([
                    context.target.getIcons().map((icon) => ability.effects.addIcon(icon)),
                    context.target
                        .getPrintedKeywords()
                        .map((keyword) => ability.effects.addKeyword(keyword)),
                    context.target
                        .getFactions()
                        .map((faction) => ability.effects.addFaction(faction)),
                    context.target.getTraits().map((trait) => ability.effects.addTrait(trait))
                ]);

                this.untilEndOfPhase(() => ({
                    match: this,
                    effect: effectArr
                }));

                this.game.addMessage(
                    "{0} uses {1} to have {1} gain each of {2}'s printed challenge icons, keywords, faction affiliations and traits",
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

FacelessMan.code = '09040';

export default FacelessMan;
