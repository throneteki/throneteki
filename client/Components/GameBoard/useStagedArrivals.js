import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    captureCards,
    drawHoldRemaining,
    playPendingFlip,
    sequenceStep,
    wasOnBoard
} from '../../flip';

export const stepForArrivals = sequenceStep;

// Which cards to hold back this update. A hand that is swapped during setup (a mulligan) is dealt
// again in full, even for cards that happen to be in the new hand as well.
export const arrivalsToStage = ({ previous, cards, queued, redeal, enabled, isOnBoard }) => {
    if (!enabled) {
        return {};
    }

    const current = new Set(cards.map((card) => card.uuid));
    const draws = cards
        .filter((card) => !previous.has(card.uuid) && !isOnBoard(card.uuid))
        .map((card) => card.uuid);

    if (redeal && draws.length > 0 && [...previous].some((uuid) => !current.has(uuid))) {
        return { replace: cards.map((card) => card.uuid) };
    }
    if (draws.length >= 2 || (draws.length > 0 && queued > 0)) {
        return { add: draws };
    }
    return {};
};

// Holds back newly drawn cards and releases them one at a time, so the area grows by one slot per card
export const useStagedArrivals = (cards, enabled, redeal = false) => {
    const seen = useRef(null);
    const queue = useRef([]);
    const timer = useRef(null);
    const started = useRef(false);
    const total = useRef(0);
    const [tick, setTick] = useState(0);

    const uuids = new Set(cards.map((card) => card.uuid));
    if (seen.current === null) {
        seen.current = uuids;
    } else {
        const staging = arrivalsToStage({
            previous: seen.current,
            cards,
            queued: queue.current.length,
            redeal,
            enabled,
            isOnBoard: wasOnBoard
        });
        seen.current = uuids;
        if (staging.replace) {
            queue.current = [...staging.replace];
            total.current = queue.current.length;
            started.current = false;
        } else if (staging.add) {
            queue.current.push(...staging.add);
            total.current = queue.current.length;
        }
    }
    queue.current = queue.current.filter((uuid) => uuids.has(uuid));

    useEffect(() => {
        if (queue.current.length === 0) {
            started.current = false;
            return;
        }
        if (timer.current) {
            return;
        }

        const delay = started.current ? stepForArrivals(total.current) : drawHoldRemaining();
        started.current = true;
        const release = () => {
            timer.current = null;
            if (queue.current.length === 0) {
                return;
            }
            const wait = drawHoldRemaining();
            if (wait > 0) {
                timer.current = setTimeout(release, wait);
                return;
            }
            captureCards();
            queue.current = queue.current.slice(1);
            setTick((value) => value + 1);
        };
        timer.current = setTimeout(release, delay);
    });

    useEffect(
        () => () => {
            clearTimeout(timer.current);
            timer.current = null;
        },
        []
    );

    useLayoutEffect(() => {
        if (tick > 0) {
            playPendingFlip();
        }
    }, [tick]);

    if (queue.current.length === 0) {
        return cards;
    }

    const hidden = new Set(queue.current);
    return cards.filter((card) => !hidden.has(card.uuid));
};
