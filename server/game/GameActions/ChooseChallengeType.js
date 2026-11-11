import ChallengeTypes from '../ChallengeTypes.js';
import ChooseGameAction from './ChooseGameAction.js';

class ChooseChallengeType extends ChooseGameAction {
    constructor({
        player,
        title = 'Select a challenge type',
        message,
        exclude = () => undefined,
        gameAction
    }) {
        super({
            player,
            title,
            choices: (context) =>
                Object.fromEntries(
                    ChallengeTypes.all
                        .filter(({ value }) => ![].concat(exclude(context)).includes(value))
                        .map(({ text, value }) => [
                            text,
                            {
                                message: ChooseChallengeType.messageFor(message, value),
                                gameAction: gameAction(value)
                            }
                        ])
                )
        });
    }

    static messageFor(message, challengeType) {
        if (!message) {
            return undefined;
        }

        const fill = (format) => format.replaceAll('{challengeType}', challengeType);
        return typeof message === 'string'
            ? fill(message)
            : { ...message, format: fill(message.format) };
    }
}

export default ChooseChallengeType;
