import React from 'react'

const RadioWithMsg = props => {
    const {
        name, // this props is from Field, it is a key for fields
        showMsg=false, // this props is from Field, a flag for showing error message
        msgChildren='no message', // this props is from Field, content of error message
        _ref, // this props is from Field, help locate field which happens error
        onChange,  // wrappered by Field
        label,
        required, 
        ...rest
        } = props

        const NameOrLabel = label || name

    return (
        <div className="my-radio">
            <label>
                {
                    required && 
                    <i className="base-required">*</i>
                }
                {NameOrLabel}：
            </label>
            <>
                 <input
                    ref={_ref}
                    type="radio"
                    name={NameOrLabel}
                    onClick={() => onChange('unkown')}
                    className={showMsg ? 'base-error-foucs' : '' }
                    {...rest}
                />unkown
                <input
                    name={NameOrLabel}
                    type="radio"
                    onClick={() => onChange('male')}
                    {...rest}
                />male
                <input
                    type="radio"
                    name={NameOrLabel}
                    onClick={() => onChange('female')}
                    {...rest}
                />female
            </>
            {
                showMsg && 
                <span className="base-msg">{msgChildren}</span>
            }
        </div>
    )
}

export default RadioWithMsg
