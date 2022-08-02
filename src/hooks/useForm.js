import { useState } from 'react';

export const useForm = (initialState = {}) => {
    const [values, setValues] = useState(initialState);
    console.log(values)
    const reset = () => {
        setValues(initialState);
    }

    const handleInputChange = ({target}) => {
        setValues({
            ...values,
            [target.name]: target.value
        });
    }

    return [values, handleInputChange, reset];
}
