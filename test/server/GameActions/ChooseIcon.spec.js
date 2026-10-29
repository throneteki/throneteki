import ChooseIcon from '../../../server/game/GameActions/ChooseIcon.js';

describe('ChooseIcon', function () {
    beforeEach(function () {
        this.actions = {};
        this.gameAction = (icon) => {
            this.actions[icon] = { name: icon, allow: () => true };
            return this.actions[icon];
        };
    });

    it('offers a choice for each challenge icon', function () {
        const action = new ChooseIcon({ gameAction: this.gameAction });
        const choices = action.createChoices(action.choicesFunc({}));

        expect(choices.map((choice) => choice.text)).toEqual(['Military', 'Intrigue', 'Power']);
        expect(choices.map((choice) => choice.gameAction)).toEqual([
            this.actions.military,
            this.actions.intrigue,
            this.actions.power
        ]);
    });

    it('shows each challenge icon on its button', function () {
        const action = new ChooseIcon({ gameAction: this.gameAction });
        const choices = action.createChoices(action.choicesFunc({}));

        expect(choices.map((choice) => choice.icon)).toEqual(['military', 'intrigue', 'power']);
    });

    it('only offers the icons listed in icons', function () {
        const action = new ChooseIcon({
            icons: ['intrigue', 'power'],
            gameAction: this.gameAction
        });
        const choices = action.createChoices(action.choicesFunc({}));

        expect(choices.map((choice) => choice.text)).toEqual(['Intrigue', 'Power']);
    });

    it('titles the prompt "Select an icon" by default', function () {
        expect(new ChooseIcon({ gameAction: this.gameAction }).title).toBe('Select an icon');
    });

    it('fills {icon} in the message with the chosen icon and its article', function () {
        expect(ChooseIcon.messageFor('{player} gains {icon} icon', 'military')).toBe(
            '{player} gains a military icon'
        );
        expect(ChooseIcon.messageFor('{player} gains {icon} icon', 'intrigue')).toBe(
            '{player} gains an intrigue icon'
        );
        expect(
            ChooseIcon.messageFor({ format: '{player} gives {icon} icon', args: {} }, 'power')
        ).toEqual({ format: '{player} gives a power icon', args: {} });
    });
});
