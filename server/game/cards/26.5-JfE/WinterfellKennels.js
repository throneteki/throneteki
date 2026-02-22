import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WinterfellKennels extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.isMatch({ type: 'character', trait: 'Direwolf' }),
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Put Direwolf into play',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                activePromptTitle: 'Select a card',
                cardCondition: {
                    trait: 'Direwolf',
                    location: 'hand',
                    controller: 'current',
                    condition: (card) => GameActions.putIntoPlay({ card }).allow()
                }
            },
            message: '{player} kneels {source} to put {target} into play',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.putIntoPlay((context) => ({
                            card: context.target
                        })),
                        GameActions.genericHandler((context) => {
                            this.atEndOfPhase((ability) => ({
                                match: context.target,
                                condition: () =>
                                    ['play area', 'duplicate'].includes(context.target.location),
                                targetLocation: 'any',
                                effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                            }));
                        })
                    ]),
                    context
                );
            }
        });
    }
}

WinterfellKennels.code = '26092';

export default WinterfellKennels;
