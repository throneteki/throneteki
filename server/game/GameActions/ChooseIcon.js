import ChallengeTypes from '../ChallengeTypes.js';
import ChooseGameAction from './ChooseGameAction.js';

class ChooseIcon extends ChooseGameAction {
    constructor({
        player,
        title = 'Select an icon',
        message,
        icons = ChallengeTypes.all.map(({ value }) => value),
        gameAction
    }) {
        super({
            player,
            title,
            choices: Object.fromEntries(
                ChallengeTypes.all
                    .filter(({ value }) => icons.includes(value))
                    .map(({ text, value }) => [
                        text,
                        {
                            message: ChooseIcon.messageFor(message, value),
                            gameAction: gameAction(value)
                        }
                    ])
            )
        });
    }

    static messageFor(message, icon) {
        if (!message) {
            return undefined;
        }

        const article = icon === 'intrigue' ? 'an' : 'a';
        const fill = (format) => format.replaceAll('{icon}', `${article} ${icon}`);
        return typeof message === 'string'
            ? fill(message)
            : { ...message, format: fill(message.format) };
    }
}

export default ChooseIcon;
