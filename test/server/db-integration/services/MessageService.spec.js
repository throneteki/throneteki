import { resetDatabase } from '../helpers/database.js';
import MessageService from '../../../../server/services/MessageService.js';
import NewsService from '../../../../server/services/NewsService.js';

const poster = { username: 'Stark', name: 'Stark', role: 'user' };

describe('Postgres MessageService and NewsService', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.messageService = new MessageService();
        this.newsService = new NewsService();
    });

    describe('lobby chat', function () {
        it('should return the latest messages, newest first', async function () {
            const first = await this.messageService.addMessage({
                user: poster,
                message: 'Winter is coming',
                time: new Date('2026-01-01T00:00:00Z')
            });
            await this.messageService.addMessage({
                user: poster,
                message: 'The north remembers',
                time: new Date('2026-01-02T00:00:00Z')
            });

            expect(first._id).toEqual(jasmine.any(String));

            const messages = await this.messageService.getLastMessages(false);
            expect(messages.map((message) => message.message)).toEqual([
                'The north remembers',
                'Winter is coming'
            ]);
            expect(messages[0].user).toEqual(poster);
        });

        it('should hide deleted messages from everyone but moderators', async function () {
            const message = await this.messageService.addMessage({ user: poster, message: 'spam' });
            const listener = jasmine.createSpy('messageDeleted');
            this.messageService.on('messageDeleted', listener);

            await this.messageService.removeMessage(message._id, { username: 'Admin' });

            const [hidden] = await this.messageService.getLastMessages(false);
            expect(hidden.message).toBeUndefined();
            expect(hidden.deletedBy).toBeUndefined();

            const [visible] = await this.messageService.getLastMessages(true);
            expect(visible.message).toBe('spam');
            expect(visible.deletedBy).toBe('Admin');
            expect(listener).toHaveBeenCalledWith(message._id, { username: 'Admin' });
        });
    });

    describe('message of the day', function () {
        it('should set, replace and clear the message of the day', async function () {
            expect(await this.messageService.getMotdMessage()).toEqual([]);

            await this.messageService.setMotdMessage({
                message: 'Maintenance tonight',
                motdType: 'warning',
                type: 'motd',
                user: poster,
                time: new Date()
            });
            await this.messageService.setMotdMessage({
                message: 'Maintenance tomorrow',
                motdType: 'info',
                type: 'motd',
                user: poster,
                time: new Date()
            });

            let motd = await this.messageService.getMotdMessage();
            expect(motd.length).toBe(1);
            expect(motd[0]).toEqual(
                jasmine.objectContaining({ message: 'Maintenance tomorrow', motdType: 'info' })
            );

            await this.messageService.setMotdMessage({});

            motd = await this.messageService.getMotdMessage();
            expect(motd[0].message).toBeNull();
        });
    });

    describe('news', function () {
        it('should add, list, edit and delete news items', async function () {
            const older = await this.newsService.addNews({
                poster: 'Admin',
                text: 'Older',
                datePublished: new Date('2026-01-01T00:00:00Z')
            });
            await this.newsService.addNews({
                poster: 'Admin',
                text: 'Newer',
                datePublished: new Date('2026-02-01T00:00:00Z')
            });

            expect(
                (await this.newsService.getRecentNewsItems({ limit: 1 })).map((item) => item.text)
            ).toEqual(['Newer']);

            await this.newsService.editNews(older._id, 'Edited');
            expect((await this.newsService.getRecentNewsItems()).map((item) => item.text)).toEqual([
                'Newer',
                'Edited'
            ]);

            await this.newsService.deleteNews(older._id);
            expect((await this.newsService.getRecentNewsItems()).length).toBe(1);
        });
    });
});
