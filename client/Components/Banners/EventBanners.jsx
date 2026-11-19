import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useGetBannersQuery } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import { requestEventGame } from '../../redux/reducers/lobby';
import { toast } from 'react-toastify';
import { bannerImageUrl } from '../../util';
import BannerSlide from './BannerSlide';

const RotateInterval = 8000;

const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(
        () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    );

    useEffect(() => {
        const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (!query) {
            return;
        }

        const onChange = (event) => setReduced(event.matches);
        query.addEventListener('change', onChange);

        return () => query.removeEventListener('change', onChange);
    }, []);

    return reduced;
};

const isKeyboardFocus = (element) => {
    try {
        return element.matches(':focus-visible');
    } catch {
        return true;
    }
};

const EventBanners = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const games = useSelector((state) => state.lobby.games);
    const { data: banners } = useGetBannersQuery();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [interacting, setInteracting] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

    const count = banners?.length ?? 0;
    const rotating = count > 1 && !paused && !interacting && !reducedMotion;

    useEffect(() => {
        if (!rotating) {
            return;
        }

        const timer = setInterval(() => setIndex((i) => (i + 1) % count), RotateInterval);

        return () => clearInterval(timer);
    }, [rotating, count]);

    if (count === 0) {
        return null;
    }

    const current = index % count;
    const banner = banners[current];
    const step = (offset) => setIndex((current + offset + count) % count);

    const onPlay = () => {
        if (!user) {
            toast.info('Log in to start a game for this event');
            return;
        }

        // The game list includes the user's own game, which can arrive before its game state
        const inGame =
            currentGame ||
            games.some(
                (game) =>
                    game.players?.[user.username] ||
                    game.spectators?.some((spectator) => spectator.name === user.username)
            );
        if (inGame) {
            toast.info('Leave your current game to start one for this event');
            return;
        }

        dispatch(requestEventGame(banner.eventId));
        dispatch(navigate('/play'));
    };

    return (
        <section
            aria-roledescription='carousel'
            aria-label='Upcoming events'
            onPointerEnter={(event) => event.pointerType === 'mouse' && setInteracting(true)}
            onPointerLeave={(event) => event.pointerType === 'mouse' && setInteracting(false)}
            onFocus={(event) => {
                if (isKeyboardFocus(event.target)) {
                    setInteracting(true);
                }
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setInteracting(false);
                }
            }}
        >
            <div
                role='group'
                aria-roledescription='slide'
                aria-label={`${current + 1} of ${count}`}
                aria-live={rotating ? 'off' : 'polite'}
            >
                <BannerSlide
                    banner={banner}
                    imageUrl={bannerImageUrl(banner.image)}
                    onPlay={onPlay}
                >
                    {count > 1 && (
                        <div className='absolute bottom-1 right-1 flex items-center gap-0.5 rounded-md bg-black/70 px-1'>
                            <Button
                                isIconOnly
                                size='sm'
                                className='text-white'
                                aria-label='Previous event'
                                onPress={() => step(-1)}
                                variant='ghost'
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                            <span className='text-xs tabular-nums text-white'>
                                {current + 1} / {count}
                            </span>
                            <Button
                                isIconOnly
                                size='sm'
                                className='text-white'
                                aria-label='Next event'
                                onPress={() => step(1)}
                                variant='ghost'
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Button>
                            {!reducedMotion && (
                                <Button
                                    isIconOnly
                                    size='sm'
                                    className='text-white'
                                    aria-label={paused ? 'Start rotating' : 'Stop rotating'}
                                    onPress={() => setPaused(!paused)}
                                    variant='ghost'
                                >
                                    <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                                </Button>
                            )}
                        </div>
                    )}
                </BannerSlide>
            </div>
        </section>
    );
};

export default EventBanners;
