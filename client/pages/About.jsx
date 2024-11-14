import React from 'react';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import { Button } from '@nextui-org/react';

const About = () => {
    return (
        <div className='w-2/3 mx-auto'>
            <Panel title='About The Iron Throne - Help and information'>
                <div className='flex'>
                    <div className='flex-1'>
                        <h3 className='text-large font-bold mt-2'>What is this?</h3>
                        <p className='mt-1'>
                            This site was setup to allow you to play A Game Of Thrones 2.0, an LCG
                            from Fantasy Flight Games (FFG) in your browser.
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
                <h3 className='text-large font-bold mt-2'>
                    Tha&apos;s pretty cool! But how does any of this work?
                </h3>
                <p className='mt-1'>
                    Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a
                    thorough explanation.
                </p>
                <h3 className='text-large font-bold mt-2'>
                    Everyone has a shiny avatar, how do I get one?
                </h3>
                <p className='mt-1'>
                    This is handled by the good people at
                    <a href='http://gravatar.com' target='_blank' rel='noreferrer'>
                        Gravatar
                    </a>
                    . Sign up there with the same email address you did there and it should appear
                    on the site after a short while. It will also use the avatar on any site that
                    uses gravatar. Examples include github and jinteki.
                </p>
                <h3 className='text-large font-bold mt-2'>
                    The artwork on this site is pretty cool, where&apos;s that from?
                </h3>
                <p className='mt-1'>You&apos;re right, it is pretty nice isn&apos;t it?</p>
                <p className='mt-1'>
                    The background of the site is by an artist named{' '}
                    <a href='http://dumaker.deviantart.com/' target='_blank' rel='noreferrer'>
                        Dumaker
                    </a>{' '}
                    and can be found{' '}
                    <a
                        href='http://dumaker.deviantart.com/art/Looking-for-the-Iron-Throne-Game-of-Thrones-9-364330141'
                        target='_blank'
                        rel='noreferrer'
                    >
                        here
                    </a>
                    .
                </p>
                <p className='mt-1'>
                    The in game backgrounds are by{' '}
                    <a href='http://www.thomastanart.com/' target='_blank' rel='noreferrer'>
                        Thomas Tan
                    </a>
                    . He&apos;s very talented, you should check out his work!
                </p>
                <p className='mt-1'>
                    Don&apos;t want to be distracted by beautiful art during your games? In-game
                    backgrounds can be disabled from your <Link href='/profile'>Profile</Link>.
                </p>
                <p className='mt-1'>
                    Card hand icon is by Henry Ryder from{' '}
                    <a href='http://www.thenounproject.com' target='_blank' rel='noreferrer'>
                        the Noun Project
                    </a>
                    .
                </p>
                <p className='mt-1'>
                    Chat icon made by{' '}
                    <a href='https://www.flaticon.com/authors/iconnice' title='Iconnice'>
                        Iconnice
                    </a>{' '}
                    from{' '}
                    <a href='https://www.flaticon.com/' title='Flaticon'>
                        www.flaticon.com
                    </a>{' '}
                    is licensed by{' '}
                    <a
                        href='http://creativecommons.org/licenses/by/3.0/'
                        title='Creative Commons BY 3.0'
                        target='_blank'
                        rel='noreferrer'
                    >
                        CC 3.0 BY
                    </a>
                </p>
                <p className='mt-1'>
                    Time Limit icon made by{' '}
                    <a href='https://www.flaticon.com/authors/minh-hoang' title='Minh Hoang'>
                        Minh Hoang
                    </a>{' '}
                    from{' '}
                    <a href='https://www.flaticon.com/' title='Flaticon'>
                        www.flaticon.com
                    </a>{' '}
                    is licensed by{' '}
                    <a
                        href='http://creativecommons.org/licenses/by/3.0/'
                        title='Creative Commons BY 3.0'
                        target='_blank'
                        rel='noreferrer'
                    >
                        CC 3.0 BY
                    </a>
                </p>
                <p className='mt-1'>
                    Chess Clock icon made by{' '}
                    <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>
                        Freepik
                    </a>{' '}
                    from{' '}
                    <a href='https://www.flaticon.com/' title='Flaticon'>
                        www.flaticon.com
                    </a>{' '}
                    is licensed by{' '}
                    <a
                        href='https://www.freepikcompany.com/legal#nav-flaticon-agreement'
                        title='Flaticon License'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Flaticon License
                    </a>
                </p>
                <p className='mt-1'>
                    Raven icon by Bluetip Design from{' '}
                    <a href='https://thenounproject.com/term/raven/683810/'>the Noun Project</a>
                </p>
                <h3 className='text-large font-bold mt-2'>Can I help?</h3>
                <p className='mt-1'>
                    Sure! The project is all written in Javascript. The server is node.js and the
                    client is React.js. The source code can be found in the&nbsp;
                    <a target='_blank' href='http://github.com/cryogen/throneteki' rel='noreferrer'>
                        GitHub Repository
                    </a>
                    . Check out the code and instructions on there on how to get started and hack
                    away! See the card implementation status list above to have a look at what needs
                    to be done. If you want to join the dev discord, or ask any other question, send
                    me a note on here, over at&nbsp;
                    <a target='_blank' href='http://www.twitter.com/cryogen' rel='noreferrer'>
                        Twitter
                    </a>{' '}
                    or post in the AGoT Facebook group. I&apos;ll likely find it.
                </p>
                <h2 className='text-2xl mt-2 font-bold'>Special Thanks</h2>
                <p className='mt-1'>
                    I&apos;d like to thank mtgred, and the whole of the jinteki.net development
                    team(except whoever decided to write the code in clojure, not you. - just
                    kidding!) as without their work to use as a guide and as inspiration, this site
                    would not be where it is today. To say jinteki is an inspiration is an
                    understatement.
                </p>
                <h2 className='text-2xl mt-2 font-bold'>Additional Notes</h2>
                <p className='mt-1'>
                    The Game of Thrones living card game, the artwork and many other things are all
                    copyright Fantasy Flight Games and I make no claims of ownership or otherwise of
                    any of the artwork or trademarks. This site exists for passionate fans to play a
                    game they enjoy and augment, rather than replace, the in person LCG. FFG does
                    not endorse, support, and is not involved with, this site in any way.
                </p>
            </Panel>
        </div>
    );
};

export default About;
