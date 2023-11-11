export const Input = ({ type, className, placeholder, name, value, handleChange }) => {
    return (
        <input 
            type={type}
            className={className}
            placeholder={placeholder}
            name={name}
            onChange={handleChange}
            value={value}
            autoComplete="off"
        />
    )
}
