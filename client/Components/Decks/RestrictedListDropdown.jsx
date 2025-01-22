import { Select, SelectItem } from "@heroui/react";
import React, { useState, useEffect, useCallback } from 'react';

const RestrictedListDropdown = ({
    currentRestrictedList,
    restrictedLists,
    setCurrentRestrictedList,
    onChange
}) => {
    const [value, setValue] = useState(currentRestrictedList && currentRestrictedList._id);

    const updateRestrictedList = useCallback(
        (restrictedListName) => {
            setValue(restrictedListName);
            let restrictedList = restrictedLists.find((rl) => rl._id === restrictedListName);

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

    useEffect(() => {
        if (!value && restrictedLists) {
            setValue(restrictedLists[0]._id);
        }
    }, [restrictedLists, value]);

    return (
        <Select
            label={'Game mode'}
            onChange={(e) => updateRestrictedList(e.target.value)}
            selectedKeys={value ? new Set([value]) : null}
        >
            {restrictedLists?.map((rl) => (
                <SelectItem key={rl._id} value={rl._id}>
                    {rl.name}
                </SelectItem>
            ))}
        </Select>
    );
};

export default RestrictedListDropdown;
