import React from 'react';
import './Switch.css';

export const Switch = ({isOn, onToggle, id}) => {

    const handleChange = (e) => {
        const customEvent = {
            target: {
                name: id,
                value: !isOn,
            }
        };
        onToggle(customEvent);
    };


    return (
        <>
            <input
                id={id}
                checked={isOn}
                //onChange={() => onToggle((prev) => !prev)}
                onChange={handleChange}
                className="react-switch-checkbox"
                type="checkbox"
            />
            <label
                style={{ background: isOn && '#06D6A0' }}
                className="react-switch-label"
                htmlFor={id}
            >
                <span className={`react-switch-button`} />
            </label>
        </>
    );
};
