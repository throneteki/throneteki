import classNames from 'classnames';
import { gameActionClass } from '../../Site/GameActionButton';

// The adaptive board's prompt buttons: small game action buttons, quiet for a way out (cancel)
export const chipClass = (quiet) => classNames(gameActionClass(quiet), 'px-2 text-xs');
