import React from 'react';

import Link from './Link.jsx';

class HowToPlay extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <div className='panel-title text-center'>
                    How To Play on The Iron Throne
                </div>
                <div className='panel about-container'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/cryogen/throneteki/issues'>Report Problems</a>

                    <p>This guide is aimed at players familiar with the A Game of Thrones: The Card Game 2nd Edition who want to start playing online using The Iron Throne platform. If you are new to this cardgame in general, there is a <a href='https://www.youtube.com/watch?v=A1s54Wlgfyo' target='_blank'>helpful tutorial video</a>, a <a href='https://images-cdn.fantasyflightgames.com/filer_public/ba/2a/ba2a5ea6-a3cd-4772-a603-6f1906f63053/gt01_learn-to-play-web.pdf' target='_blank'>Learn To Play guide</a>, and a <a href='http://thronesdb.com/rulesreference' target='_blank'>Rules Reference Guide</a> to help you out.</p>

                    <h3>Adding decks</h3>
                    <p>Start by making sure you have created an account and are logged in. You must be logged in to add decks and spectate or play games. The Iron Throne has a functional <Link href='/decks'>Deckbuilder</Link>, although most people use the more fully featured <a target='_blank' href='http://www.thronesdb.com'>ThronesDB</a> deckbuilder to build their decks. After building your deck on ThronesDB download it as a TXT file, then copy and paste it into the deckbuilder here. You are now ready to start playing. Head over to the <Link href='/play'>Play</Link> section to create, join or watch games.</p>

                    <p>If you are new to Thrones 2.0, you can find an introductory Stark deck <a target='_blank' href='http://thronesdb.com/deck/view/358860'>here</a>, and an introductory Lannister/Tyrell deck <a target='_blank' href='http://thronesdb.com/deck/view/358861'>here</a>. Both decks only feature cards from the Core Set. If you are new and using any of these decks to play be sure to check the ‘Beginner’ category when creating your game, so you don’t necessarily get destroyed by an up to date power deck. If that happens anyway, just keep practicing and you’ll get the hang of it soon enough.</p>

                    <h3>Profile options</h3>
                    <p>Clicking your <Link href='/profile'>Profile</Link> at the top right of the page allows you to tailor certain aspects of gameplay to your wishes.</p>

                    <h4>> Action Windows</h4>
                    <p>Thrones 2nd Edition has quite a large number of phases and their associated action windows, a number of which are not used regularly by all decks. Always prompting these action windows leads to a lot of tediously clicking ‘Pass’, while never prompting these action windows leads to certain cards not being able to be used to their fullest extent. To solve this issue you can check/uncheck any action windows in your profile to determine when you’ll be prompted or not.</p>

                    <p>For example: if you play cards like <a target='_blank' href='https://thronesdb.com/card/01088'>The Tickler</a>, <a target='_blank' href='https://thronesdb.com/card/06031'>Wex Pyke</a>, <a target='_blank' href='https://thronesdb.com/card/01130'>Messenger Raven</a> or <a target='_blank' href='https://thronesdb.com/card/01139'>Take the Black</a> in your deck, be sure to check Dominance Actions in your profile. Your action window settings can also be changed during a game by clicking the triangle above the ‘Done’/‘Pass’ button. Lastly, the Taxation phase action window is technically not implemented currently, but actions in Taxation should be taken during the ‘End Round’ prompt</p>

                    <h4>> Timed Interrupt Window</h4>
                    <p>The combination of automated gameplay and the ability to play reactions or interrupts from hand has the potential to “leak” information about what your opponent might hold in his hand. For example: if after playing an event there is a pause before it resolves, you might guess correctly that was due to your opponent being prompted to use The Hand’s Judgment. The three most notable cards that would be leaked this way are <a target='_blank' href='https://thronesdb.com/card/01045'>The Hand's Judgment</a>, <a target='_blank' href='https://thronesdb.com/card/01102'>Treachery</a> and <a target='_blank' href='https://thronesdb.com/card/02096'>Vengeance for Elia</a>. To solve this issue, the Timed Interrupt Window was created. Depending on which options you have checked, you get a timed prompt during certain triggers asking for interrupts whether you are able to interrupt these triggers or not. Now your opponent experiences the same pause any time and won’t be able to correctly guess whether you’re holding certain cards anymore.</p>

                    <p>There are a couple of options: you can decide whether you want to always be prompted for triggered card abilities (useful if you’re playing Treachery), events (useful if you’re playing The Hand’s Judgment, The Pack Survives, etc.) or both. Claim (useful if you’re playing Vengeance for Elia) is currently combined with the event option. The timer duration can be modified too. Obviously, if you don’t care about leaking cards from your hand (or you don’t play these cards anyway) and just want a quick game, deselecting both options will allow for that. You will still get prompted to use the aforementioned cards, but only when you actually have them.</p>

                    <h3>Bugs and automation</h3>
                    <p>While The Iron Throne is still a work in progress, the vast majority of cards are implemented and should be working correctly. We try to keep a list up to date with the current state of the automation which can be found <a target='_blank' href='https://docs.google.com/spreadsheets/d/1t7ITlfkaUvso30QEZIbqswv3FM0N95UtWc-RDtPLdIQ'>here</a>. If you happen upon a card that you believe is not working as it should and it is not on that list, it would help immensely if you would submit an issue on <a target='_blank' href='https://github.com/cryogen/throneteki/issues'>GitHub</a>. Other comments and/or feedback can be left on GitHub as well.</p>

                    <h3>Manual Commands</h3>
                    <p>Every once in a while something happens during a game that shouldn’t have happened. This can occur due to a misclick, an unimplemented card or a bug in the software. To fix the game state in such situations a variety of manual commands are implemented. Typing these commands as a chatmessage during a game will have the following effect:</p>

                    <ul>
                        <li>/bestow x - Adds x gold to the selected card. You must have enough gold to add</li>
                        <li>/cancel-prompt - Clear the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue</li>
                        <li>/discard x - Discards x cards randomly from your hand</li>
                        <li>/draw x - Draws x cards from your deck to your hand</li>
                        <li>/give-control - Give control of a card to your opponent.  Use with caution</li>
                        <li>/give-icon x - Give a character an x icon; where 'x' is one of 'military', 'intrigue', 'power'</li>
                        <li>/kill - Manually kill a character.  Use with caution</li>
                        <li>/move-bottom - Moves a card to the bottom of your draw deck</li>
                        <li>/pillage - Discards the top card from your deck</li>
                        <li>/power x - Sets the power of a card to x</li>
                        <li>/strength x - Sets the strength of a card to x</li>
                        <li>/take-icon x - Take an x icon from a character; where 'x' is as per '/give-icon'</li>
                        <li>/token t x - Set the token count of a card of type 't' to 'x'. Currently used token types are: 'betrayal', 'ear', 'gold', 'kiss', 'poison', 'stand', 'valarmorghulis', 'vengeance' and 'venom'</li>
                    </ul>

                    <h3>About stats, conceding, and leaving games</h3>

                    <p>The Iron Throne does not rank and/or match players by skill level in any way. There are three categories (beginner, casual and competitive) to be chosen when creating a game which gives an indication of what to expect, but it doesn't enforce anything. Even though personal stats are not being tracked, most players still very much appreciate a formal concede by clicking the ‘Concede’ button and typing ‘gg’ before leaving a game. The reality of quick and anonymous online games dictates this won’t always happen though, as evidenced by regular complaining in the main lobby about people leaving without conceding. Our advice is to just move on to the next game since in the end, conceding or not doesn’t really impact anything. Happy gaming!</p>
                </div>
            </div>
        );
    }
}

HowToPlay.displayName = 'How To Play';
HowToPlay.propTypes = {
};

export default HowToPlay;
