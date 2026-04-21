/*eslint no-console:0 */
import monk from 'monk';
import ServiceFactory from '../services/ServiceFactory.js';

const configService = ServiceFactory.configService();
const db = monk(configService.getValue('dbPath'));
const dbDecks = db.get('decks');

const CHUNK_SIZE = 1000;

const convertDeck = (deck) => {
    const updates = {
        bannerCards: [],
        plotCards: [],
        drawCards: []
    };

    if (deck.agenda && typeof deck.agenda !== 'string') {
        updates.agenda = deck.agenda.code;
    }

    if (deck.bannerCards?.some((card) => typeof card !== 'string')) {
        updates.bannerCards = deck.bannerCards.map((card) => card.code);
    }

    if (deck.plotCards?.some((cq) => cq.cardcode === undefined)) {
        updates.plotCards = deck.plotCards.map((cq) => ({
            cardcode: cq.card.code,
            count: cq.count
        }));
    }

    if (deck.drawCards?.some((cq) => cq.cardcode === undefined)) {
        updates.drawCards = deck.drawCards.map((cq) => ({
            cardcode: cq.card.code,
            count: cq.count
        }));
    }

    return Object.keys(updates).length > 0 ? { id: deck._id, updates } : null;
};

const convertDecks = async () => {
    const startTime = Date.now();
    console.log(`[${new Date().toLocaleTimeString()}] Starting deck conversion...`);

    const count = await dbDecks.count({});
    console.log(
        `[${new Date().toLocaleTimeString()}] Found ${count.toLocaleString()} decks to process`
    );

    let numberProcessed = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let lastId = null;
    let chunk = 0;

    while (numberProcessed < count) {
        chunk++;
        const chunkStart = Date.now();

        const query = lastId ? { _id: { $gt: lastId } } : {};
        const decks = await dbDecks.find(query, { limit: CHUNK_SIZE, sort: { _id: 1 } });

        if (decks.length === 0) {
            console.log(`[${new Date().toLocaleTimeString()}] No more decks found, stopping early`);
            break;
        }

        const mapped = decks.map(convertDeck);
        const bulkOps = mapped.filter(Boolean).map(({ id, updates }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: updates }
            }
        }));

        const skipped = mapped.filter((d) => d === null).length;
        totalSkipped += skipped;

        if (bulkOps.length > 0) {
            await dbDecks.bulkWrite(bulkOps);
        }

        totalUpdated += bulkOps.length;
        lastId = decks[decks.length - 1]._id;
        numberProcessed += decks.length;

        const chunkMs = Date.now() - chunkStart;
        const percent = ((numberProcessed / count) * 100).toFixed(1);
        console.log(
            `[${new Date().toLocaleTimeString()}] Chunk ${chunk}: ${numberProcessed.toLocaleString()} / ${count.toLocaleString()} (${percent}%) — updated: ${bulkOps.length}, skipped: ${skipped} — chunk took ${chunkMs}ms`
        );
    }

    const totalMs = Date.now() - startTime;
    const totalSecs = (totalMs / 1000).toFixed(1);
    console.log(`\n[${new Date().toLocaleTimeString()}] Conversion complete`);
    console.log(`  Total processed : ${numberProcessed.toLocaleString()}`);
    console.log(`  Total updated   : ${totalUpdated.toLocaleString()}`);
    console.log(`  Total skipped   : ${totalSkipped.toLocaleString()}`);
    console.log(`  Time taken      : ${totalSecs}s`);

    await db.close();
};

convertDecks();
