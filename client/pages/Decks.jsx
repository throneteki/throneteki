import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { GameFormats } from '../constants';
import Frame from '../Components/Site/Frame';
import DeckList from '../Components/Decks/DeckList';
import { useDispatch } from 'react-redux';
import { navigate } from '../redux/reducers/navigation';
import Page from './Page';
import FormatSelect from '../Components/Games/FormatSelect';
import VariantSelect from '../Components/Games/VariantSelect';
import LegalitySelect from '../Components/Games/LegalitySelect';

const Decks = () => {
    const dispatch = useDispatch();
    const [format, setFormat] = useState('joust');
    const [variant, setVariant] = useState(null);
    const [legality, setLegality] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const formatInfo = GameFormats.find((f) => f.name === format);
    const variantLabel = formatInfo?.variants.find((v) => v.name === variant)?.label;

    return (
        <Page size='wide'>
            <Frame title='Decks' bodyClassName='gap-5'>
                <button
                    type='button'
                    className='flex items-center justify-between gap-3 border-y border-gold-hair py-2.5 text-left text-sm text-ink-dim sm:hidden'
                    aria-expanded={showOptions}
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <span>
                        Showing{' '}
                        <span className='text-ink'>
                            {[formatInfo?.label, variantLabel].filter(Boolean).join(', ')}
                        </span>{' '}
                        decks
                    </span>
                    <span className='flex items-center gap-1.5 text-gold'>
                        {showOptions ? 'Done' : 'Change'}
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={classNames('text-xs transition-transform', {
                                'rotate-180': showOptions
                            })}
                        />
                    </span>
                </button>
                <div
                    className={classNames('grid grid-cols-1 gap-3 sm:grid-cols-3', {
                        'max-sm:hidden': !showOptions
                    })}
                >
                    <FormatSelect
                        label='Format'
                        selected={format}
                        onSelected={setFormat}
                        disallowEmptySelection
                    />
                    <VariantSelect
                        label='Variant'
                        format={format}
                        selected={variant}
                        onSelected={setVariant}
                        disallowEmptySelection
                    />
                    <LegalitySelect
                        label='Legality'
                        format={format}
                        variant={variant}
                        selected={legality}
                        onSelected={setLegality}
                    />
                </div>
                <DeckList
                    format={format}
                    variant={variant}
                    legality={legality}
                    onDeckSelected={(deck) => dispatch(navigate(`/decks/edit/${deck._id}/`))}
                />
            </Frame>
        </Page>
    );
};

export default Decks;
