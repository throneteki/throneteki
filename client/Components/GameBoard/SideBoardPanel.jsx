import React from 'react';
import GameTimer from './GameTimer';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import { sendButtonClickedMessage } from '../../redux/reducers/game';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

const SideBoardPanel = ({ collapsable, player, thisPlayer, isMe, side }) => {
    const dispatch = useDispatch();

    // Side panel must be treated differently for the 2 left-most boards, and for top/bottom
    const sidePanelClassName = classNames(
        'sticky left-0 z-[240] flex flex-col p-1 pointer-events-none',
        {
            'bottom-0 justify-end': side === 'bottom',
            'top-0 justify-start': side === 'top',
            'w-32 md:w-48 lg:w-64': !collapsable
        }
    );

    return (
        <div className={sidePanelClassName}>
            {!!player && <GameTimer player={player} isMe={isMe} side={side} />}
            {isMe && (
                <ActivePlayerPrompt
                    className='pointer-events-auto'
                    buttons={thisPlayer.buttons}
                    controls={thisPlayer.controls}
                    promptText={thisPlayer.menuTitle}
                    promptTitle={thisPlayer.promptTitle}
                    onButtonClick={(button) =>
                        dispatch(
                            sendButtonClickedMessage(
                                button.promptId,
                                button.command,
                                button.method,
                                button.arg
                            )
                        )
                    }
                    user={player.user}
                    phase={thisPlayer.phase}
                    // timerLimit={this.props.timerLimit}
                    // timerStartTime={this.props.timerStartTime}
                    // stopAbilityTimer={this.props.stopAbilityTimer}
                />
            )}
        </div>
    );
};

export default SideBoardPanel;
