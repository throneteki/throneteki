import { isMotionEnabled } from '../../client/motion.js';

describe('isMotionEnabled', function () {
    it('is on by default', function () {
        expect(isMotionEnabled({})).toBe(true);
        expect(isMotionEnabled({ animations: true, reducedMotion: false })).toBe(true);
    });

    it('is off when the profile setting is off', function () {
        expect(isMotionEnabled({ animations: false, reducedMotion: false })).toBe(false);
    });

    it('is off when the browser asks for reduced motion, whatever the profile says', function () {
        expect(isMotionEnabled({ animations: true, reducedMotion: true })).toBe(false);
    });
});
