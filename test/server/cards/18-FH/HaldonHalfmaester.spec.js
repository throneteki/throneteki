import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Haldon Halfmaester', function () {
    function setup(topCard) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Haldon Halfmaester', 'Hedge Knight'], drawDeck: [topCard] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.haldonHalfmaester);
        this.player1.triggerAbility('Haldon Halfmaester');
    }

    it('places 1 gold on a card with the same cardtype as the revealed card', function () {
        setup.call(this, 'Castle Guard');
        expect(this.player1).toHavePrompt('Select card to gain 1 gold');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.tokens[Tokens.gold]).toBe(1);
    });

    it('draws the revealed card if it is an event', function () {
        setup.call(this, 'Bribery (R)');
        expect(this.bribery.location).toBe('hand');
    });

    it('puts the revealed card into play if it is Aegon Targaryen', function () {
        setup.call(this, 'Aegon Targaryen (TSC)');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.tokens[Tokens.gold]).toBe(1);
        expect(this.aegonTargaryen.location).toBe('play area');
    });
});
