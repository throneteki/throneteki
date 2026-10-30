import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Lady extends DrawCard {
    // Lady (02004)
    // [stark] character only. Terminal.
    // Attached character gets +2 STR.
    // Action: Pay 1 gold to attach Lady to a different character. Then, if attached character is
    // Sansa Stark, stand her. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.action({
            title: 'Attach Lady to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: { location: 'play area', type: 'character' }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} pays 1 gold to attach {source} to {target}',
            gameAction: GameActions.attach((context) => ({
                attachment: context.source,
                target: context.target
            })).then({
                condition: (context) => context.parentContext.target.name === 'Sansa Stark',
                message: {
                    format: 'Then {player} stands {sansa}',
                    args: { sansa: (context) => context.parentContext.target }
                },
                gameAction: GameActions.standCard((context) => ({
                    card: context.parentContext.target
                }))
            })
        });
    }
}

Lady.code = '02004';

export default Lady;
