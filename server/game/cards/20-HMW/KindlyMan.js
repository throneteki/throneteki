import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

const TokenTypes = Tokens.list().filter((token) => token !== 'gold' && token !== 'power');

const chooseToken = (createAction) =>
    GameActions.choose({
        title: 'Select token',
        message: '{player} uses {source} and {gameAction}',
        choices: (context) =>
            Object.fromEntries(
                TokenTypes.map((token) => [token, createAction({ card: context.target, token })])
            )
    });

class KindlyMan extends DrawCard {
    // Kindly Man (20044)
    // Ambush (4). Shadow (2).
    // Reaction: After Kindly Man stands, choose an agenda or a card in play and, either: place a
    // non-gold, non-power token of your choice on that card; or discard a non-gold, non-power token
    // from that card. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event, context) => event.card === context.source
            },
            limit: ability.limit.perRound(3),
            target: {
                activePromptTitle: 'Select card to gain or lose a token',
                cardCondition: (card) =>
                    ['active plot', 'faction', 'play area', 'agenda'].includes(card.location),
                cardType: ['agenda', 'attachment', 'character', 'faction', 'location', 'plot']
            },
            gameAction: GameActions.choose({
                title: 'Gain or lose token?',
                choices: {
                    'Gain token': chooseToken((props) => GameActions.placeToken(props)),
                    'Lose token': chooseToken((props) => GameActions.discardToken(props))
                }
            })
        });
    }
}

KindlyMan.code = '20044';

export default KindlyMan;
