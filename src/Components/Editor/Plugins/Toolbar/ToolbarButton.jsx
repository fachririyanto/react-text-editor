const buttonClass = 'flex items-center px-1.5 h-full rounded hover:bg-gray-100'

export const ButtonFormat = ({ children, isActive, ...props }) => {
    let additionalClasses = ''

    if (isActive) {
        additionalClasses += ' bg-gray-100 text-blue-500'
    }

    return (
        <button className={ `${buttonClass} ${additionalClasses}` } { ...props }>
            { children }
        </button>
    )
}

export const ButtonEnabled = ({ children, isEnabled, ...props }) => {
    let additionalClasses = ''

    if (!isEnabled) {
        additionalClasses += ' opacity-50 cursor-not-allowed'
    }

    return (
        <button className={ `${buttonClass} ${additionalClasses}` } { ...props }>
            { children }
        </button>
    )
}