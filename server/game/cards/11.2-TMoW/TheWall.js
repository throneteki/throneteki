import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWall extends DrawCard {
    // The Wall (11026)
    // Each character you control gains the [thenightswatch] affiliation and loses all other faction
    // affiliations.
    // Action: Kneel The Wall to choose an opponent. Put an eligible character of that player’s
    // choice from his or her discard pile into play under your control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            effect: [
                ability.effects.loseFaction('stark'),
                ability.effects.loseFaction('lannister'),
                ability.effects.loseFaction('tyrell'),
                ability.effects.loseFaction('martell'),
                ability.effects.loseFaction('targaryen'),
                ability.effects.loseFaction('greyjoy'),
                ability.effects.loseFaction('baratheon'),
                ability.effects.addFaction('thenightswatch')
            ]
        });

        this.action({
            title: 'Take control of character',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message:
                '{player} kneels {source} to have {opponent} choose a character in their discard pile for {player} to put into play',
            gameAction: GameActions.chooseCards({
                player: (context) => context.opponent,
                title: 'Select a character',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card, context) =>
                    GameActions.putIntoPlay({ player: context.player, card })
            })
        });
    }
}

TheWall.code = '11026';

export default TheWall;
