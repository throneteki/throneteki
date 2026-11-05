import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Sea of Blood (KotI)', function () {
    it('places a blood token and searches your deck for an event after you win a military challenge by 5', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Sea of Blood (KotI)',
                inPlay: ['Ranging Party'],
                drawDeck: ['Consolidation of Power']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rangingParty);
        this.player1.triggerAbility('Sea of Blood');
        this.player1.clickCard(this.consolidationOfPower);
        expect(this.seaOfBlood.tokens[Tokens.blood]).toBe(1);
        expect(this.consolidationOfPower.location).toBe('hand');
    });

    it('reduces the cost of events you play during military challenges by 1 for each blood token', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: { card: 'Sea of Blood (KotI)', tokens: { [Tokens.blood]: 1 } },
                inPlay: ['Hedge Knight'],
                hand: ['A Dragon Is No Slave'],
                gold: 2
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.aDragonIsNoSlave);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1Object.gold).toBe(1);
    });

    it('stops you playing events during intrigue challenges', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Sea of Blood (KotI)',
                inPlay: ['Courtesan of the Rose'],
                hand: ['A Dragon Is No Slave'],
                gold: 2
            }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.courtesanOfTheRose);
        this.player1.clickPrompt('Done');
        expect(this.player1Object.canPlay(this.aDragonIsNoSlave)).toBe(false);
    });
});
