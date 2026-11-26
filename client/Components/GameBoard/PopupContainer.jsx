import React, { createContext, useContext } from 'react';
import MovablePanel from './MovablePanel';
import BoardSheet from './Adaptive/BoardSheet';

// How the board shows a pile's cards: in a panel that floats beside the pile, one per pile ('panel', on a desktop),
// or in a sheet along the bottom of the screen ('sheet', on phones)
export const PopupHostContext = createContext('panel');

// Inside a sheet, how its cards are laid out: { height: 'strip' | 'peek' | 'full', plots }
export const SheetContext = createContext(null);
export const useSheetLayout = () => useContext(SheetContext);

// pileTitle and playerName, for the sheets and panels: the pile's own name and whose it is.
// prompting, for sheets: whether the popup is open because its cards are to be chosen from
const PopupContainer = (props) => {
    const host = useContext(PopupHostContext);
    return host === 'sheet' ? <BoardSheet {...props} /> : <MovablePanel {...props} />;
};

export default PopupContainer;
