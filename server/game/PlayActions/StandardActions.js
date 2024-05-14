import AmbushCardAction from './AmbushCardAction.js';
import MarshalCardAction from './MarshalCardAction.js';
import MarshalDuplicateAction from './MarshalDuplicateAction.js';
import MarshalIntoShadowsAction from './MarshalIntoShadowsAction.js';
import OutOfShadowsAction from './OutOfShadowsAction.js';
import SetupCardAction from './SetupCardAction.js';
import SetupInShadowsAction from './SetupInShadowsAction.js';

export default [
    new AmbushCardAction(),
    new MarshalCardAction(),
    new MarshalDuplicateAction(),
    new MarshalIntoShadowsAction(),
    new OutOfShadowsAction(),
    new SetupCardAction(),
    new SetupInShadowsAction()
];
