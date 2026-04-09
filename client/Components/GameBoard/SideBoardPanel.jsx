import React from 'react';
import classNames from 'classnames';
import GameTimer from './GameTimer';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import { sendButtonClickedMessage } from '../../redux/reducers/game';
import { useDispatch } from 'react-redux';

const SideBoardPanel = ({
    collapsable,
    player,
    userPlayer,
    isMe,
    side,
    soloMode,
    soloActingPlayer,
    actingPlayerName
}) => {
    const dispatch = useDispatch();

    // Side panel must be treated differently for the 2 left-most boards, and for top/bottom
    const sidePanelClassName = classNames(
        'sticky left-0 z-[250] flex flex-col p-1 pointer-events-none',
        {
            'bottom-0 justify-end': side === 'bottom',
            'top-0 justify-start': side === 'top',
            'w-32 md:w-48 lg:w-64': !collapsable
        }
    );

    // In solo mode, use the player's own prompt data so each side shows its own buttons.
    // In non-solo mode player === userPlayer for the bottom (isMe) side, so this is equivalent.
    const promptSource = isMe ? player : userPlayer;

    // In solo mode, grey out the panel that isn't the active cursor player
    const isActiveSoloSide = !soloMode || soloActingPlayer === actingPlayerName;

    return (
        <div className={sidePanelClassName}>
            {!!player && <GameTimer player={player} isMe={isMe} side={side} />}
            {isMe && (
                <ActivePlayerPrompt
                    className={classNames('pointer-events-auto', {
                        'opacity-40': !isActiveSoloSide
                    })}
                    buttons={promptSource?.buttons}
                    controls={promptSource?.controls}
                    promptText={promptSource?.menuTitle}
                    promptTitle={promptSource?.promptTitle}
                    onButtonClick={(button) => {
                        if (!isActiveSoloSide) return;
                        dispatch(
                            sendButtonClickedMessage(
                                button.promptId,
                                button.command,
                                button.method,
                                button.arg
                            )
                        );
                    }}
                    phase={player.phase}
                    // timerLimit={this.props.timerLimit}
                    // timerStartTime={this.props.timerStartTime}
                    // stopAbilityTimer={this.props.stopAbilityTimer}
                />
            )}
        </div>
    );
};

export default SideBoardPanel;
