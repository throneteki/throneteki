import AbilityMessage from './AbilityMessage.js';

class AbilityTargetMessages {
    constructor(properties) {
        let messages = properties.messages || { selected: properties.message };
        this.selected = AbilityMessage.create(messages.selected);
        this.unable = AbilityMessage.create(messages.unable);
        this.noneSelected = AbilityMessage.create(messages.noneSelected);
        this.skipped = AbilityMessage.create(messages.skipped);
    }

    outputSelected(outputter, context) {
        this.selected.output(outputter, context);
    }

    outputUnable(outputter, context) {
        this.unable.output(outputter, context);
    }

    outputNoneSelected(outputter, context) {
        this.noneSelected.output(outputter, context);
    }

    outputSkipped(outputter, context) {
        this.skipped.output(outputter, context);
    }
}

export default AbilityTargetMessages;
