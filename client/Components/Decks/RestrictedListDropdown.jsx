import React, { useState, useEffect, useCallback } from 'react';

const RestrictedListDropdown = ({
    currentRestrictedList,
    restrictedLists,
    setCurrentRestrictedList,
    onChange
}) => {
    const [value, setValue] = useState(currentRestrictedList && currentRestrictedList.name);

    const updateRestrictedList = useCallback(
        (restrictedListName) => {
            setValue(restrictedListName);
            let restrictedList = restrictedLists.find((rl) => rl.name === restrictedListName);

            if (restrictedList.useDefaultRestrictedList && restrictedList.defaultRestrictedList) {
                restrictedList = restrictedLists.find(
                    (rl) => rl.name === restrictedList.defaultRestrictedList
                );
            }

            if (setCurrentRestrictedList) {
                setCurrentRestrictedList(restrictedList);
            }

            if (onChange) {
                onChange(restrictedList);
            }
        },
        [onChange, restrictedLists, setCurrentRestrictedList]
    );

    useEffect(() => {
        if (!currentRestrictedList && restrictedLists.length > 0) {
            updateRestrictedList(restrictedLists[0].name);
        }
    }, [currentRestrictedList, restrictedLists, updateRestrictedList]);

    const handleChange = useCallback(
        (event) => {
            const selectedName = event.target.value;
            updateRestrictedList(selectedName);
        },
        [updateRestrictedList]
    );

    return (
        <>
            <label htmlFor='current-restricted-list'>Restricted List:</label>
            <select
                id='current-restricted-list'
                className='form-control'
                value={value}
                onChange={handleChange}
            >
                {restrictedLists.map((rl, index) => (
                    <option key={index} value={rl.name}>
                        {rl.name}
                    </option>
                ))}
            </select>
        </>
    );
};

export default RestrictedListDropdown;
