/*eslint no-console:0 */
import monk from 'monk';
import ServiceFactory from '../services/ServiceFactory.js';

const configService = ServiceFactory.configService();
const db = monk(configService.getValue('dbPath'));
const dbEvents = db.get('events');

const CHUNK_SIZE = 1000;

const convertEvent = (event) => {
    const updates = {};

    updates.format = 'joust';
    updates.variant = event.variant ?? 'standard';
    updates.legality = 'latest';
    updates.customLegality = null;

    updates.lockDecks = event.lockDecks ?? false;
    updates.useEventGameOptions = event.useEventGameOptions ?? false;
    updates.restrictTableCreators = event.restrictTableCreators ?? false;
    updates.restrictSpectators = event.restrictSpectators ?? false;

    if (event.useEventGameOptions && event.eventGameOptions) {
        updates.eventGameOptions = {
            spectators: event.eventGameOptions.spectators ?? false,
            muteSpectators: event.eventGameOptions.muteSpectators ?? false,
            showHand: event.eventGameOptions.showHand ?? false,
            useGameTimeLimit: event.eventGameOptions.useGameTimeLimit ?? false,
            gameTimeLimit: event.eventGameOptions.useGameTimeLimit
                ? Number(event.eventGameOptions.gameTimeLimit)
                : null,
            useChessClocks: event.eventGameOptions.useChessClocks ?? false,
            chessClockTimeLimit: event.eventGameOptions.useChessClocks
                ? Number(event.eventGameOptions.chessClockTimeLimit)
                : null,
            chessClockDelay: event.eventGameOptions.useChessClocks
                ? Number(event.eventGameOptions.chessClockDelay)
                : null,
            password: event.eventGameOptions.password
        };
    } else {
        updates.useEventGameOptions = false;
        updates.eventGameOptions = null;
    }

    updates.validTableCreators = event.restrictTableCreators
        ? (event.validTableCreators ?? [])
        : null;
    updates.validSpectators = event.restrictSpectators ? (event.validSpectators ?? []) : null;

    const unsetFields = {
        id: '',
        banned: '',
        restricted: '',
        defaultRestrictedList: '',
        useDefaultRestrictedList: '',
        draftOptions: '',
        pods: ''
    };

    return { id: event._id, updates, unsetFields };
};

const convertEvents = async () => {
    const startTime = Date.now();
    console.log(`[${new Date().toLocaleTimeString()}] Starting event conversion...`);

    const count = await dbEvents.count({});
    console.log(
        `[${new Date().toLocaleTimeString()}] Found ${count.toLocaleString()} events to process`
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
        const events = await dbEvents.find(query, { limit: CHUNK_SIZE, sort: { _id: 1 } });

        if (events.length === 0) {
            console.log(
                `[${new Date().toLocaleTimeString()}] No more events found, stopping early`
            );
            break;
        }

        const mapped = events.map((event) => ({ event, result: convertEvent(event) }));

        const bulkOps = mapped
            .filter(({ result }) => result !== null)
            .map(({ result: { id, updates, unsetFields } }) => ({
                updateOne: {
                    filter: { _id: id },
                    update: {
                        $set: updates,
                        $unset: unsetFields
                    }
                }
            }));

        const skipped = mapped
            .filter(({ result }) => result === null)
            .map(({ event }) => event._id);
        totalSkipped += skipped.length;

        if (skipped.length > 0) {
            console.log(`  Skipped IDs: ${skipped.join(', ')}`);
        }

        if (bulkOps.length > 0) {
            await dbEvents.bulkWrite(bulkOps);
        }

        totalUpdated += bulkOps.length;
        lastId = events[events.length - 1]._id;
        numberProcessed += events.length;

        const chunkMs = Date.now() - chunkStart;
        const percent = ((numberProcessed / count) * 100).toFixed(1);
        console.log(
            `[${new Date().toLocaleTimeString()}] Chunk ${chunk}: ${numberProcessed.toLocaleString()} / ${count.toLocaleString()} (${percent}%) — updated: ${bulkOps.length}, skipped: ${skipped.length} — chunk took ${chunkMs}ms`
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

convertEvents();
