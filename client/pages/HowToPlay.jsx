import React from 'react';

import Frame from '../Components/Site/Frame';
import { buttonVariants, Link } from '@heroui/react';
import Page from './Page';
import { KeyboardShortcutsTable } from '../Components/GameBoard/KeyboardShortcutsModal';

const HowToPlay = () => {
    return (
        <Page>
            <Frame
                title='How to play'
                description='Getting started on The Iron Throne, and how the site handles the parts of the game that need you.'
                actions={
                    <a
                        className={buttonVariants({ variant: 'tertiary' })}
                        target='_blank'
                        href='https://github.com/throneteki/throneteki/issues'
                        rel='noreferrer'
                    >
                        Report a problem
                    </a>
                }
            >
                <div className='prose-site'>
                    <h2>Introduction</h2>
                    <p>
                        This guide is aimed at players familiar with the A Game of Thrones: The Card
                        Game 2nd Edition who want to start playing online using The Iron Throne
                        platform. If you are new to this cardgame in general, there is a{' '}
                        <Link
                            href='https://www.youtube.com/watch?v=A1s54Wlgfyo'
                            target='_blank'
                            rel='noreferrer'
                        >
                            helpful tutorial video
                        </Link>
                        , a{' '}
                        <Link
                            href='https://images-cdn.fantasyflightgames.com/filer_public/ba/2a/ba2a5ea6-a3cd-4772-a603-6f1906f63053/gt01_learn-to-play-web.pdf'
                            target='_blank'
                            rel='noreferrer'
                        >
                            Learn To Play guide
                        </Link>
                        , and a{' '}
                        <Link
                            href='http://thronesdb.com/rulesreference'
                            target='_blank'
                            rel='noreferrer'
                        >
                            Rules Reference Guide
                        </Link>{' '}
                        to help you out.
                    </p>
                    <section>
                        <h2>Topics</h2>
                        <ul>
                            <li>
                                <Link href='#decks'>Adding Decks</Link>
                            </li>
                            <li>
                                <Link href='#profile'>Profile Options</Link>

                                <ul>
                                    <li>
                                        <Link href='#action'>Action Windows</Link>
                                    </li>
                                    <li>
                                        <Link href='#timed'>Timed Interrupt Window</Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href='#shortcuts'>Keyboard Shortcuts</Link>
                            </li>
                            <li>
                                <Link href='#framework-timing-sheet'>Framework Timing Sheet</Link>
                            </li>
                            <li>
                                <Link href='#bugs'>Bugs and Automation</Link>
                            </li>
                            <li>
                                <Link href='#interactions'>Specific Card Interactions</Link>

                                <ul>
                                    <li>
                                        <Link href='#riddle'>
                                            Varys&apos; Riddle vs Summer Harvest
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link href='#commands'>Manual Commands</Link>
                            </li>
                            <li>
                                <Link href='#conceding'>
                                    About Stats, Conceding and Leaving Games
                                </Link>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 id='decks'>Adding Decks</h2>
                        <p>
                            Start by making sure you have created an account and are logged in. You
                            must be logged in to add decks and spectate or play games. The Iron
                            Throne has a functional <Link href='/decks'>Deckbuilder</Link>, although
                            most people use the more fully featured{' '}
                            <Link target='_blank' href='http://www.thronesdb.com' rel='noreferrer'>
                                ThronesDB
                            </Link>{' '}
                            deckbuilder to build their decks. After building your deck on ThronesDB
                            download it as a TXT file, then copy and paste it into the deckbuilder
                            here. You are now ready to start playing. Head over to the{' '}
                            <Link href='/play'>Play</Link> section to create, join or watch games.
                        </p>
                        <p>
                            If you are new to Thrones 2.0, you can find an introductory Stark deck{' '}
                            <Link
                                target='_blank'
                                href='http://thronesdb.com/deck/view/358860'
                                rel='noreferrer'
                            >
                                here
                            </Link>
                            , and an introductory Lannister/Tyrell deck{' '}
                            <Link
                                target='_blank'
                                href='http://thronesdb.com/deck/view/358861'
                                rel='noreferrer'
                            >
                                here
                            </Link>
                            . Both decks only feature cards from the Core Set. If you are new and
                            using any of these decks to play be sure to check the ‘Beginner’
                            category when creating your game, so you don’t necessarily get destroyed
                            by an up to date power deck. If that happens anyway, just keep
                            practicing and you’ll get the hang of it soon enough.
                        </p>
                    </section>
                    <section>
                        <h2 id='profile'>Profile Options</h2>
                        <p>
                            Clicking your <Link href='/profile/gameplay'>Profile</Link> at the top
                            right of the page allows you to tailor certain aspects of gameplay to
                            your wishes.
                        </p>

                        <div>
                            <h3 id='action'>Action Windows</h3>
                            <p>
                                Thrones 2nd Edition has quite a large number of phases and their
                                associated action windows, a number of which are not used regularly
                                by all decks. Always prompting these action windows leads to a lot
                                of tediously clicking ‘Pass’, while never prompting these action
                                windows leads to certain cards not being able to be used to their
                                fullest extent. To solve this issue you can check/uncheck any action
                                windows in your profile to determine when you’ll be prompted or not.
                            </p>
                            <p>
                                For example: if you play cards like{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/01088'
                                    rel='noreferrer'
                                >
                                    The Tickler
                                </Link>
                                ,{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/06031'
                                    rel='noreferrer'
                                >
                                    Wex Pyke
                                </Link>
                                ,{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/01130'
                                    rel='noreferrer'
                                >
                                    Messenger Raven
                                </Link>{' '}
                                or{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/01139'
                                    rel='noreferrer'
                                >
                                    Take the Black
                                </Link>{' '}
                                in your deck, be sure to check Dominance Actions in your profile.
                                Your action window settings can also be changed during a game by
                                clicking the settings button on the bottom of your screen.
                            </p>
                        </div>

                        <div>
                            <h3 id='timed'>Timed Interrupt Window</h3>
                            <p>
                                The combination of automated gameplay and the ability to play
                                reactions or interrupts from hand has the potential to “leak”
                                information about what your opponent might hold in his hand. For
                                example: if after playing an event there is a pause before it
                                resolves, you might guess correctly that was due to your opponent
                                being prompted to use The Hand’s Judgment. The three most notable
                                cards that would be leaked this way are{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/01045'
                                    rel='noreferrer'
                                >
                                    The Hand&apos;s Judgment
                                </Link>
                                ,{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/01102'
                                    rel='noreferrer'
                                >
                                    Treachery
                                </Link>{' '}
                                and{' '}
                                <Link
                                    target='_blank'
                                    href='https://thronesdb.com/card/02096'
                                    rel='noreferrer'
                                >
                                    Vengeance for Elia
                                </Link>
                                . To solve this issue, the Timed Interrupt Window was created.
                                Depending on which options you have checked, you get a timed prompt
                                during certain triggers asking for interrupts whether you are able
                                to interrupt these triggers or not. Now your opponent experiences
                                the same pause any time and won’t be able to correctly guess whether
                                you’re holding certain cards anymore.
                            </p>
                            <p>
                                There are a couple of options: you can decide whether you want to
                                always be prompted for triggered card abilities (useful if you’re
                                playing Treachery), events (useful if you’re playing The Hand’s
                                Judgment, The Pack Survives, etc.) or both. Claim (useful if you’re
                                playing Vengeance for Elia) is currently combined with the event
                                option. The timer duration can be modified too. Obviously, if you
                                don’t care about leaking cards from your hand (or you don’t play
                                these cards anyway) and just want a quick game, deselecting both
                                options will allow for that. You will still get prompted to use the
                                aforementioned cards, but only when you actually have them.
                            </p>
                        </div>
                    </section>
                    <section>
                        <h2 id='shortcuts'>Keyboard Shortcuts</h2>
                        <p>
                            In a game on a larger screen, the buttons on your prompt show the key
                            that presses them. Shortcuts are ignored while you are typing in the
                            chat or a card name box, and can be turned off under Game Settings in
                            your profile.
                        </p>
                        <KeyboardShortcutsTable />
                    </section>
                    <section>
                        <h2 id='framework-timing-sheet'>Framework Timing Sheet</h2>
                        <p>
                            Below you will find a sheet summarizing the framework and the timings of
                            the game in a quick reference:
                        </p>
                        <img
                            src='/img/AGOT-2nd-Ed-framework-timing-sheet.jpg'
                            alt='The framework timing sheet'
                            className='w-full'
                        />
                    </section>
                    <section>
                        <h2 id='bugs'>Bugs and automation</h2>
                        <p>
                            While The Iron Throne is still a work in progress, the vast majority of
                            cards are implemented and should be working correctly. We keep a list up
                            to date with unimplemented and partially implemented cards{' '}
                            <Link
                                target='_blank'
                                href='https://github.com/cryogen/throneteki/projects'
                                rel='noreferrer'
                            >
                                here
                            </Link>
                            . If you happen upon a card that you believe is not working as it should
                            and it is not on that list, it would help immensely if you would submit
                            an issue on{' '}
                            <Link
                                target='_blank'
                                href='https://github.com/cryogen/throneteki/issues'
                                rel='noreferrer'
                            >
                                GitHub
                            </Link>
                            . Other comments and/or feedback can be left on GitHub as well.
                        </p>
                    </section>
                    <section>
                        <h2 id='interactions'>Specific Card Interactions</h2>

                        <div>
                            <h3 id='riddle'>
                                <Link
                                    href='https://thronesdb.com/card/04020'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Varys&apos; Riddle
                                </Link>{' '}
                                vs{' '}
                                <Link
                                    href='https://thronesdb.com/card/04039'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Summer Harvest
                                </Link>
                            </h3>
                            <p>
                                CardGameDB rule threads on this interaction:{' '}
                                <Link
                                    href='http://www.cardgamedb.com/forums/index.php?/topic/32255-varys-riddle-vs-summer-harvest/'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    1
                                </Link>
                                ,{' '}
                                <Link
                                    href='http://www.cardgamedb.com/forums/index.php?/topic/33283-timming-varys-riddle-summer-harvest/'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    2
                                </Link>
                                .
                            </p>
                            <p>
                                These plots have a very specific interaction that&apos;s implemented
                                a little differently from the official ruling. Officially, X will be
                                defined by both plots and thus will be both 2 and 7. The first
                                player will consequently decide what value X is whenever it gets
                                referenced (a more thorough explanation is detailed in the above
                                links). On The Iron Throne it is implemented a little differently.
                                As the player who revealed Varys&apos; Riddle, to make sure your
                                opponent&apos;s value of X will be 2, you have to go first and
                                trigger Summer Harvest first. As the player who revealed Summer
                                Harvest, if the Varys&apos; Riddle player has made you first player
                                (or you won initiative somehow), you&apos;d want to trigger
                                Varys&apos; Riddle first to make sure your X is 7.
                            </p>
                        </div>
                    </section>
                    <section>
                        <h2 id='commands'>Manual Commands</h2>
                        <p>
                            Every once in a while something happens during a game that shouldn’t
                            have happened. This can occur due to a misclick, an unimplemented card
                            or a bug in the software. To fix the game state in such situations a
                            variety of manual commands are implemented. Typing these commands as a
                            chatmessage during a game will have the following effect:
                        </p>
                        <ul>
                            <li>
                                <code>/bestow x</code> Adds x gold to the selected card. You must
                                have enough gold to add.
                            </li>
                            <li>
                                <code>/cancel-challenge</code> Cancels the current challenge after
                                it has been initiated. <strong>Note:</strong> both players will need
                                to manually stand any knelt characters and undo any abilities used.
                            </li>
                            <li>
                                <code>/cancel-prompt</code> Clears the current prompt and resume the
                                game flow. Use with caution and only when the prompt is
                                &apos;stuck&apos; and you are unable to continue.
                            </li>
                            <li>
                                <code>/discard x</code> Discards x cards randomly from your hand.
                            </li>
                            <li>
                                <code>/draw x</code> Draws x cards from your deck to your hand.
                            </li>
                            <li>
                                <code>/give-control</code> Gives control of a card to your opponent.
                                Use with caution.
                            </li>
                            <li>
                                <code>/give-icon x</code> Gives a character an x icon; where
                                &apos;x&apos; is one of &apos;military&apos;, &apos;intrigue&apos;,
                                &apos;power&apos;.
                            </li>
                            <li>
                                <code>/kill</code> Kills a character. Use with caution.
                            </li>
                            <li>
                                <code>/move-bottom</code> Moves a card to the bottom of your draw
                                deck.
                            </li>
                            <li>
                                <code>/move-shadows</code> Moves a card to your shadows area.
                            </li>
                            <li>
                                <code>/pillage</code> Discards the top card from your deck.
                            </li>
                            <li>
                                <code>/power x</code> Sets the power of a card to x.
                            </li>
                            <li>
                                <code>/rematch</code> Start over a new game with the current
                                opponent.
                            </li>
                            <li>
                                <code>/remove-from-game</code> Removes a card from the game.
                            </li>
                            <li>
                                <code>/reveal-hand</code> Reveals your hand to the opponent.
                            </li>
                            <li>
                                <code>/strength x</code> Sets the strength of a card to x.
                            </li>
                            <li>
                                <code>/take-icon x</code> Takes an x icon from a character; where
                                &apos;x&apos; is as per &apos;/give-icon&apos;.
                            </li>
                            <li>
                                <code>/token t x</code> Sets the token count of a card of type
                                &apos;t&apos; to &apos;x&apos;. Currently used token types are:
                                &apos;bell&apos;, &apos;betrayal&apos;, &apos;ear&apos;,
                                &apos;ghost&apos;, &apos;gold&apos;, &apos;journey&apos;,
                                &apos;kiss&apos;, &apos;poison&apos;, &apos;prayer&apos;
                                &apos;stand&apos;, &apos;tale&apos;, &apos;valarmorghulis&apos;,
                                &apos;vengeance&apos; and &apos;venom&apos;.
                            </li>
                            <li>
                                <code>/mute-spectators</code> Mutes spectators so they can´t use the
                                chat. Using this command a second time enables the chat again.
                            </li>
                            <li>
                                <code>/pause-clock</code> Pauses/Unpauses all players clocks until
                                /pause-clock is used again.
                            </li>
                            <li>
                                <code>/add-chess-clock-time x</code> Adds x seconds to the players
                                chess clock timelimit.
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 id='conceding'>About Stats, Conceding, and Leaving Games</h2>
                        <p>
                            The Iron Throne does not rank and/or match players by skill level in any
                            way. There are three categories (beginner, casual and competitive) to be
                            chosen when creating a game which gives an indication of what to expect,
                            but it doesn&apos;t enforce anything. Your results are recorded on your
                            Stats page so you can look back on your games, but they are just for
                            you: they aren&apos;t used to rank you, match you or compare you with
                            anyone else, so there&apos;s no need to worry about them. Most players
                            still very much appreciate a formal concede by clicking the ‘Concede’
                            button and typing ‘gg’ before leaving a game. The reality of quick and
                            anonymous online games dictates this won’t always happen though, as
                            evidenced by regular complaining in the main lobby about people leaving
                            without conceding. Our advice is to just move on to the next game since
                            in the end, a win, a loss or an opponent leaving early doesn’t really
                            matter. Happy gaming!
                        </p>
                    </section>
                </div>
            </Frame>
        </Page>
    );
};

export default HowToPlay;
