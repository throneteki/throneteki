import React, { useState } from 'react';
import Panel from '../Components/Site/Panel';
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

    return (
        <Page>
            <Panel title='Decks'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <FormatSelect
                            label='Format'
                            selected={format}
                            onSelected={setFormat}
                            disallowEmptySelection
                            className='basis-1/3'
                        />
                        <VariantSelect
                            label='Variant'
                            format={format}
                            selected={variant}
                            onSelected={setVariant}
                            disallowEmptySelection
                            className='basis-1/3'
                        />
                        <LegalitySelect
                            label='Legality'
                            format={format}
                            variant={variant}
                            selected={legality}
                            onSelected={setLegality}
                            className='basis-1/3'
                        />
                    </div>
                    <DeckList
                        gameFormat={format}
                        restrictedList={null}
                        onDeckSelected={(deck) => dispatch(navigate(`/decks/edit/${deck._id}/`))}
                    />
                </div>
            </Panel>
        </Page>
    );
};

export default Decks;
