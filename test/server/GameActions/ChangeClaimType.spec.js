import ChangeClaimType from '../../../server/game/GameActions/ChangeClaimType.js';

describe('ChangeClaimType', function () {
    beforeEach(function () {
        this.claimEvent = { cancelled: false, claim: { challengeType: 'military' } };
    });

    describe('allow()', function () {
        it('returns true when the claim type would change', function () {
            expect(ChangeClaimType.allow({ event: this.claimEvent, challengeType: 'power' })).toBe(
                true
            );
        });

        it('returns false when the claim is already of that type', function () {
            expect(
                ChangeClaimType.allow({ event: this.claimEvent, challengeType: 'military' })
            ).toBe(false);
        });

        it('returns false when the claim event has been cancelled', function () {
            this.claimEvent.cancelled = true;
            expect(ChangeClaimType.allow({ event: this.claimEvent, challengeType: 'power' })).toBe(
                false
            );
        });
    });

    it('changes the claim type when it resolves', function () {
        const event = ChangeClaimType.createEvent({
            event: this.claimEvent,
            challengeType: 'power'
        });
        event.executeHandler();

        expect(this.claimEvent.claim.challengeType).toBe('power');
    });
});
