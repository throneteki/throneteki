import React, { createContext, useContext } from 'react';
import MovablePanel from './MovablePanel';
import BoardSheet from './Adaptive/BoardSheet';

// How the board shows a pile's cards: in a panel that floats beside the pile ('panel', the classic board), or in
// a sheet along the bottom of the screen ('sheet', the adaptive board on touch screens and phone layouts)
export const PopupHostContext = createContext('panel');

// Inside a sheet, how its cards are laid out: { height: 'strip' | 'peek' | 'full', plots }
export const SheetContext = createContext(null);
export const useSheetLayout = () => useContext(SheetContext);

// pileTitle, playerName and prompting are only used by sheets: the pile's own name and whose it is, and whether the
// popup is open because its cards are to be chosen from
const PopupContainer = (props) =>
    useContext(PopupHostContext) === 'sheet' ? (
        <BoardSheet {...props} />
    ) : (
        <MovablePanel {...props} />
    );

export default PopupContainer;
