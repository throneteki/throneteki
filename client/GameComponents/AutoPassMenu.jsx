import React from 'react';

class AutoPassMenu extends React.Component {
    onToggle(option, value) {
        if(this.props.onToggle) {
            this.props.onToggle(option, !value);
        }
    }

    render() {
        return (
            <div className='panel auto-pass'>
            Auto pass action windows
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.plot } onChange={ this.onToggle.bind(this, 'plot', this.props.options.plot) } />Plots Revealed
                    </label>
                </div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.draw } onChange={ this.onToggle.bind(this, 'draw', this.props.options.draw) } />Draw Phase
                    </label>
                </div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.challengeBegin } onChange={ this.onToggle.bind(this, 'challengeBegin', this.props.options.challengeBegin) } />Challenge Phase Begins
                    </label>
                </div>
                <div className='checkbox'>
                <label>
                    <input type='checkbox' checked={ this.props.options.attackersDeclared } onChange={ this.onToggle.bind(this, 'attackersDeclared', this.props.options.attackersDeclared) } />Attackers Declared
                </label></div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.defendersDeclared } onChange={ this.onToggle.bind(this, 'defendersDeclared', this.props.options.defendersDeclared) } />Defenders Declared
                    </label></div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.dominance } onChange={ this.onToggle.bind(this, 'dominance', this.props.options.dominance) } />Dominance Phase
                    </label></div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.standing } onChange={ this.onToggle.bind(this, 'standing', this.props.options.standing) } />Standing Phase
                    </label></div>
                <div className='checkbox'>
                    <label>
                        <input type='checkbox' checked={ this.props.options.taxation } onChange={ this.onToggle.bind(this, 'taxation', this.props.options.taxation) } />Taxation Phase
                    </label>
                </div>
            </div>
        );
    }
}

AutoPassMenu.displayName = 'AutoPassMenu';
AutoPassMenu.propTypes = {
    onToggle: React.PropTypes.func,
    options: React.PropTypes.object
};

export default AutoPassMenu;
