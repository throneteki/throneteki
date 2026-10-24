import SimultaneousActions from './SimultaneousActions.js';
import ThenAbilityAction from './ThenAbilityAction.js';

class SimultaneousAction extends SimultaneousActions {
    then(abilityPropertiesFactory) {
        return new ThenAbilityAction(this, abilityPropertiesFactory);
    }
}

export default SimultaneousAction;
