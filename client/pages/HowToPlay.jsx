import React from 'react';

import Panel from '../Components/Site/Panel';
import { Button, Link } from "@heroui/react";

const HowToPlay = () => {
    return (
        <div className='w-2/3 mx-auto'>
            <Panel title='How To Play on The Iron Throne'>
                <h2 className='mb-3 text-large font-bold border-b-1 border-b-gray-300'>
                    Introduction
                </h2>
                <div className='flex'>
                    <div className='flex-1'>
                        <p>
                            This guide is aimed at players familiar with the A Game of Thrones: The
                            Card Game 2nd Edition who want to start playing online using The Iron
                            Throne platform. If you are new to this cardgame in general, there is a{' '}
                            <a
                                href='https://www.youtube.com/watch?v=A1s54Wlgfyo'
                                target='_blank'
                                rel='noreferrer'
                            >
                                helpful tutorial video
                            </a>
                            , a{' '}
                            <a
                                href='https://images-cdn.fantasyflightgames.com/filer_public/ba/2a/ba2a5ea6-a3cd-4772-a603-6f1906f63053/gt01_learn-to-play-web.pdf'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Learn To Play guide
                            </a>
                            , and a{' '}
                            <a
                                href='http://thronesdb.com/rulesreference'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Rules Reference Guide
                            </a>{' '}
                            to help you out.
                        </p>
                    </div>
                    <Button
                        size='lg'
                        color='danger'
                        as={Link}
                        target='_blank'
                        href='https://github.com/throneteki/throneteki/issues'
                        rel='noreferrer'
                    >
                        Report Problems
                    </Button>
                </div>
                <div className='my-3'>
                    <h3 className='mb-3 text-large font-bold border-b-1 border-b-gray-300'>
                        Topics
                    </h3>
                    <ul className='m-0 p-0 font-bold'>
                        <li>
                            <a href='#decks'>Adding Decks</a>
                        </li>
                        <li>
                            <a href='#profile'>Profile Options</a>
                        </li>
                        <ul className='ml-4 font-normal p-0'>
                            <li>
                                <a href='#action'>Action Windows</a>
                            </li>
                            <li>
                                <a href='#timed'>Timed Interrupt Window</a>
                            </li>
                        </ul>
                        <li>
                            <a href='#framework-timing-sheet'>Framework Timing Sheet</a>
                        </li>
                        <li>
                            <a href='#bugs'>Bugs and Automation</a>
                        </li>
                        <li>
                            <a href='#interactions'>Specific Card Interactions</a>
                        </li>
                        <ul className='ml-4 font-normal p-0'>
                            <li>
                                <a href='#riddle'>Varys&quot; Riddle vs Summer Harvest</a>
                            </li>
                        </ul>
                        <li>
                            <a href='#commands'>Manual Commands</a>
                        </li>
                        <li>
                            <a href='#conceding'>About Stats, Conceding and Leaving Games</a>
                        </li>
                    </ul>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='decks'
                    >
                        Adding Decks
                    </h3>
                    <p>
                        Start by making sure you have created an account and are logged in. You must
                        be logged in to add decks and spectate or play games. The Iron Throne has a
                        functional <Link href='/decks'>Deckbuilder</Link>, although most people use
                        the more fully featured{' '}
                        <a target='_blank' href='http://www.thronesdb.com' rel='noreferrer'>
                            ThronesDB
                        </a>{' '}
                        deckbuilder to build their decks. After building your deck on ThronesDB
                        download it as a TXT file, then copy and paste it into the deckbuilder here.
                        You are now ready to start playing. Head over to the{' '}
                        <Link href='/play'>Play</Link> section to create, join or watch games.
                    </p>
                    <p>
                        If you are new to Thrones 2.0, you can find an introductory Stark deck{' '}
                        <a
                            target='_blank'
                            href='http://thronesdb.com/deck/view/358860'
                            rel='noreferrer'
                        >
                            here
                        </a>
                        , and an introductory Lannister/Tyrell deck{' '}
                        <a
                            target='_blank'
                            href='http://thronesdb.com/deck/view/358861'
                            rel='noreferrer'
                        >
                            here
                        </a>
                        . Both decks only feature cards from the Core Set. If you are new and using
                        any of these decks to play be sure to check the ‘Beginner’ category when
                        creating your game, so you don’t necessarily get destroyed by an up to date
                        power deck. If that happens anyway, just keep practicing and you’ll get the
                        hang of it soon enough.
                    </p>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='profile'
                    >
                        Profile Options
                    </h3>
                    <p>
                        Clicking your <Link href='/profile'>Profile</Link> at the top right of the
                        page allows you to tailor certain aspects of gameplay to your wishes.
                    </p>

                    <div className='my-3 mx-0'>
                        <h4
                            className='font-bold italic ml-2 pl-3 border-l-3 border-l-grey-400'
                            id='action'
                        >
                            Action Windows
                        </h4>
                        <p>
                            Thrones 2nd Edition has quite a large number of phases and their
                            associated action windows, a number of which are not used regularly by
                            all decks. Always prompting these action windows leads to a lot of
                            tediously clicking ‘Pass’, while never prompting these action windows
                            leads to certain cards not being able to be used to their fullest
                            extent. To solve this issue you can check/uncheck any action windows in
                            your profile to determine when you’ll be prompted or not.
                        </p>
                        <p>
                            For example: if you play cards like{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/01088'
                                rel='noreferrer'
                            >
                                The Tickler
                            </a>
                            ,{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/06031'
                                rel='noreferrer'
                            >
                                Wex Pyke
                            </a>
                            ,{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/01130'
                                rel='noreferrer'
                            >
                                Messenger Raven
                            </a>{' '}
                            or{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/01139'
                                rel='noreferrer'
                            >
                                Take the Black
                            </a>{' '}
                            in your deck, be sure to check Dominance Actions in your profile. Your
                            action window settings can also be changed during a game by clicking the
                            settings button on the bottom of your screen.
                        </p>
                    </div>

                    <div className='my-3 mx-0'>
                        <h4
                            className='font-bold italic ml-2 pl-3 border-l-3 border-l-grey-400'
                            id='timed'
                        >
                            Timed Interrupt Window
                        </h4>
                        <p>
                            The combination of automated gameplay and the ability to play reactions
                            or interrupts from hand has the potential to “leak” information about
                            what your opponent might hold in his hand. For example: if after playing
                            an event there is a pause before it resolves, you might guess correctly
                            that was due to your opponent being prompted to use The Hand’s Judgment.
                            The three most notable cards that would be leaked this way are{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/01045'
                                rel='noreferrer'
                            >
                                The Hand&apos;s Judgment
                            </a>
                            ,{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/01102'
                                rel='noreferrer'
                            >
                                Treachery
                            </a>{' '}
                            and{' '}
                            <a
                                target='_blank'
                                href='https://thronesdb.com/card/02096'
                                rel='noreferrer'
                            >
                                Vengeance for Elia
                            </a>
                            . To solve this issue, the Timed Interrupt Window was created. Depending
                            on which options you have checked, you get a timed prompt during certain
                            triggers asking for interrupts whether you are able to interrupt these
                            triggers or not. Now your opponent experiences the same pause any time
                            and won’t be able to correctly guess whether you’re holding certain
                            cards anymore.
                        </p>
                        <p>
                            There are a couple of options: you can decide whether you want to always
                            be prompted for triggered card abilities (useful if you’re playing
                            Treachery), events (useful if you’re playing The Hand’s Judgment, The
                            Pack Survives, etc.) or both. Claim (useful if you’re playing Vengeance
                            for Elia) is currently combined with the event option. The timer
                            duration can be modified too. Obviously, if you don’t care about leaking
                            cards from your hand (or you don’t play these cards anyway) and just
                            want a quick game, deselecting both options will allow for that. You
                            will still get prompted to use the aforementioned cards, but only when
                            you actually have them.
                        </p>
                    </div>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='framework-timing-sheet'
                    >
                        Framework Timing Sheet
                    </h3>
                    <p>
                        Below you will find a sheet summarizing the framework and the timings of the
                        game in a quick reference:
                    </p>
                    <img src='/img/AGOT-2nd-Ed-framework-timing-sheet.jpg' className='w-full' />
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='bugs'
                    >
                        Bugs and automation
                    </h3>
                    <p>
                        While The Iron Throne is still a work in progress, the vast majority of
                        cards are implemented and should be working correctly. We keep a list up to
                        date with unimplemented and partially implemented cards{' '}
                        <a
                            target='_blank'
                            href='https://github.com/cryogen/throneteki/projects'
                            rel='noreferrer'
                        >
                            here
                        </a>
                        . If you happen upon a card that you believe is not working as it should and
                        it is not on that list, it would help immensely if you would submit an issue
                        on{' '}
                        <a
                            target='_blank'
                            href='https://github.com/cryogen/throneteki/issues'
                            rel='noreferrer'
                        >
                            GitHub
                        </a>
                        . Other comments and/or feedback can be left on GitHub as well.
                    </p>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='interactions'
                    >
                        Specific Card Interactions
                    </h3>

                    <div className='my-3 mx-0'>
                        <h4
                            className='font-bold italic ml-2 pl-3 border-l-3 border-l-grey-400'
                            id='riddle'
                        >
                            <a
                                href='https://thronesdb.com/card/04020'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Varys&apos; Riddle
                            </a>{' '}
                            vs{' '}
                            <a
                                href='https://thronesdb.com/card/04039'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Summer Harvest
                            </a>
                        </h4>
                        <p>
                            CardGameDB rule threads on this interaction:{' '}
                            <a
                                href='http://www.cardgamedb.com/forums/index.php?/topic/32255-varys-riddle-vs-summer-harvest/'
                                target='_blank'
                                rel='noreferrer'
                            >
                                1
                            </a>
                            ,{' '}
                            <a
                                href='http://www.cardgamedb.com/forums/index.php?/topic/33283-timming-varys-riddle-summer-harvest/'
                                target='_blank'
                                rel='noreferrer'
                            >
                                2
                            </a>
                            .
                        </p>
                        <p>
                            These plots have a very specific interaction that&apos;s implemented a
                            little differently from the official ruling. Officially, X will be
                            defined by both plots and thus will be both 2 and 7. The first player
                            will consequently decide what value X is whenever it gets referenced (a
                            more thorough explanation is detailed in the above links). On The Iron
                            Throne it is implemented a little differently. As the player who
                            revealed Varys&aspos; Riddle, to make sure your opponent&aspos;s value
                            of X will be 2, you have to go first and trigger Summer Harvest first.
                            As the player who revealed Summer Harvest, if the Varys&aspos; Riddle
                            player has made you first player (or you won initiative somehow),
                            you&aspos;d want to trigger Varys&aspos; Riddle first to make sure your
                            X is 7.
                        </p>
                    </div>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='commands'
                    >
                        Manual Commands
                    </h3>
                    <p>
                        Every once in a while something happens during a game that shouldn’t have
                        happened. This can occur due to a misclick, an unimplemented card or a bug
                        in the software. To fix the game state in such situations a variety of
                        manual commands are implemented. Typing these commands as a chatmessage
                        during a game will have the following effect:
                    </p>
                    <ul>
                        <li>
                            /bestow x - Adds x gold to the selected card. You must have enough gold
                            to add.
                        </li>
                        <li>
                            /cancel-challenge - Cancels the current challenge after it has been
                            initiated. <strong>Note:</strong> both players will need to manually
                            stand any knelt characters and undo any abilities used.
                        </li>
                        <li>
                            /cancel-prompt - Clears the current prompt and resume the game flow. Use
                            with caution and only when the prompt is &apos;stuck&apos; and you are
                            unable to continue.
                        </li>
                        <li>/discard x - Discards x cards randomly from your hand.</li>
                        <li>/draw x - Draws x cards from your deck to your hand.</li>
                        <li>
                            /give-control - Gives control of a card to your opponent. Use with
                            caution.
                        </li>
                        <li>
                            /give-icon x - Gives a character an x icon; where &apos;x&apos; is one
                            of &apos;military&apos;, &apos;intrigue&apos;, &apos;power&apos;.
                        </li>
                        <li>/kill - Kills a character. Use with caution.</li>
                        <li>/move-bottom - Moves a card to the bottom of your draw deck.</li>
                        <li>/move-shadows - Moves a card to your shadows area.</li>
                        <li>/pillage - Discards the top card from your deck.</li>
                        <li>/power x - Sets the power of a card to x.</li>
                        <li>/rematch - Start over a new game with the current opponent.</li>
                        <li>/remove-from-game - Removes a card from the game.</li>
                        <li>/reveal-hand - Reveals your hand to the opponent.</li>
                        <li>/strength x - Sets the strength of a card to x.</li>
                        <li>
                            /take-icon x - Takes an x icon from a character; where &apos;x&apos; is
                            as per &apos;/give-icon&apos;.
                        </li>
                        <li>
                            /token t x - Sets the token count of a card of type &apos;t&apos; to
                            &apos;x&apos;. Currently used token types are: &apos;bell&apos;,
                            &apos;betrayal&apos;, &apos;ear&apos;, &apos;ghost&apos;,
                            &apos;gold&apos;, &apos;journey&apos;, &apos;kiss&apos;,
                            &apos;poison&apos;, &apos;prayer&apos; &apos;stand&apos;,
                            &apos;tale&apos;, &apos;valarmorghulis&apos;, &apos;vengeance&apos; and
                            &apos;venom&apos;.
                        </li>
                        <li>
                            /mute-spectators - Mutes spectators so they can´t use the chat. Using
                            this command a second time enables the chat again.
                        </li>
                        <li>
                            /pause-clock - Pauses/Unpauses all players clocks until /pause-clock is
                            used again.
                        </li>
                        <li>
                            /add-chess-clock-time x - Adds x seconds to the players chess clock
                            timelimit.
                        </li>
                    </ul>
                </div>
                <div className='my-3'>
                    <h3
                        className='mb-3 text-large font-bold border-b-1 border-b-gray-300'
                        id='conceding'
                    >
                        About Stats, Conceding, and Leaving Games
                    </h3>
                    <p>
                        The Iron Throne does not rank and/or match players by skill level in any
                        way. There are three categories (beginner, casual and competitive) to be
                        chosen when creating a game which gives an indication of what to expect, but
                        it doesn&apos;t enforce anything. Even though personal stats are not being
                        tracked, most players still very much appreciate a formal concede by
                        clicking the ‘Concede’ button and typing ‘gg’ before leaving a game. The
                        reality of quick and anonymous online games dictates this won’t always
                        happen though, as evidenced by regular complaining in the main lobby about
                        people leaving without conceding. Our advice is to just move on to the next
                        game since in the end, conceding or not doesn’t really impact anything.
                        Happy gaming!
                    </p>
                </div>
            </Panel>
        </div>
    );
};

export default HowToPlay;
