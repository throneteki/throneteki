import AbilityContext from '../../../server/game/AbilityContext.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('attach game action', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Little Bird (Core)'] },
                    'Winterfell Steward',
                    'The Roseroad'
                ],
                hand: ['Milk of the Poppy']
            }
        });

        this.context = new AbilityContext({
            game: this.game,
            player: this.player1Object,
            source: this.hedgeKnight
        });
        this.events = [];
        for (const name of ['onCardAttached', 'onCardEntersPlay']) {
            this.game.on(name, (event) =>
                this.events.push({ name, parent: (event.attachment || event.card).parent })
            );
        }
        this.attach = (props) => {
            this.game.resolveGameAction(
                GameActions.attach({ player: this.player1Object, ...props }),
                this.context
            );
            this.game.continue();
        };
    });

    it('attaches a card from hand, which enters play', function () {
        this.attach({ attachment: this.milkOfThePoppy, target: this.winterfellSteward });

        expect(this.milkOfThePoppy.location).toBe('play area');
        expect(this.milkOfThePoppy.parent).toBe(this.winterfellSteward);
        expect(this.winterfellSteward.attachments).toContain(this.milkOfThePoppy);
        expect(this.events.map((event) => event.name)).toEqual([
            'onCardAttached',
            'onCardEntersPlay'
        ]);
    });

    it('is attached by the time its events are seen', function () {
        this.attach({ attachment: this.milkOfThePoppy, target: this.winterfellSteward });

        expect(this.events).toHaveLength(2);
        expect(this.events.every((event) => event.parent === this.winterfellSteward)).toBe(true);
    });

    it('moves an attachment that is already in play without it entering play again', function () {
        this.attach({ attachment: this.littleBird, target: this.winterfellSteward });

        expect(this.littleBird.parent).toBe(this.winterfellSteward);
        expect(this.hedgeKnight.attachments).not.toContain(this.littleBird);
        expect(this.events.map((event) => event.name)).toEqual(['onCardAttached']);
    });

    it('cannot attach to a card the attachment is not allowed on', function () {
        const action = GameActions.attach({
            player: this.player1Object,
            attachment: this.milkOfThePoppy,
            target: this.theRoseroad
        });

        expect(action.allow(this.context)).toBe(false);
    });

    it('cannot attach to the card it is already attached to', function () {
        const action = GameActions.attach({
            player: this.player1Object,
            attachment: this.littleBird,
            target: this.hedgeKnight
        });

        expect(action.allow(this.context)).toBe(false);
    });
});
