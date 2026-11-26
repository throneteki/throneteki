import React, { createContext, useContext } from 'react';
import MovablePanel from './MovablePanel';
import BoardSheet from './Adaptive/BoardSheet';

// How the board shows a pile's cards: in a panel that floats beside the pile, one per pile ('panel', the classic
// board; 'board-panel', the same in the adaptive board's look on a desktop), or in a sheet along the bottom of the
// screen ('sheet', the adaptive board on phones)
export const PopupHostContext = createContext('panel');

// Inside a sheet, how its cards are laid out: { height: 'strip' | 'peek' | 'full', plots }
export const SheetContext = createContext(null);
export const useSheetLayout = () => useContext(SheetContext);

// pileTitle and playerName, for the adaptive board's sheets and panels: the pile's own name and whose it is.
// prompting, for sheets: whether the popup is open because its cards are to be chosen from
const PopupContainer = (props) => {
    const host = useContext(PopupHostContext);
    return host === 'sheet' ? (
        <BoardSheet {...props} />
    ) : (
        <MovablePanel {...props} look={host === 'board-panel' ? 'board' : 'classic'} />
    );
};

export default PopupContainer;
