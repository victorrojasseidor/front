 const Button = ({className, label, disabled}) =>{

    return (
        <button className={`${className} ${disabled}`} disabled={disabled}> {label}</button>
    )
} 

export default Button;