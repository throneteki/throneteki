import { serverWait } from '../../client/Components/GameBoard/serverWait.js';

describe('serverWait', function () {
    beforeEach(function () {
        serverWait.reset();
    });

    it('waits on nothing at first', function () {
        expect(serverWait.oldest()).toBeNull();
    });

    it('waits from the oldest message not yet handled', function () {
        serverWait.sent(100);
        serverWait.sent(200);
        serverWait.sent(300);

        expect(serverWait.oldest()).toBe(100);

        serverWait.handled(2);
        expect(serverWait.oldest()).toBe(300);

        serverWait.handled(3);
        expect(serverWait.oldest()).toBeNull();
    });

    it('keeps waiting on an update that handled none of its messages', function () {
        serverWait.sent(100);
        serverWait.handled(0);
        serverWait.handled(undefined);

        expect(serverWait.oldest()).toBe(100);
    });

    it('ignores a count that goes backwards', function () {
        serverWait.sent(100);
        serverWait.sent(200);
        serverWait.handled(1);
        serverWait.handled(0);

        expect(serverWait.oldest()).toBe(200);
    });

    it('never counts more handled than were sent', function () {
        serverWait.sent(100);
        serverWait.handled(5);
        serverWait.sent(200);

        expect(serverWait.oldest()).toBe(200);

        serverWait.handled(2);
        expect(serverWait.oldest()).toBeNull();
    });

    it('starts again when reset', function () {
        serverWait.sent(100);
        serverWait.reset();

        expect(serverWait.oldest()).toBeNull();

        serverWait.sent(200);
        serverWait.handled(1);
        expect(serverWait.oldest()).toBeNull();
    });
});
