import React from 'react'

const InputWithMsg = props => {
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
        <div className="my-input">
            <label>
                {
                    required && 
                    <i className="base-required">*</i>
                }
                {NameOrLabel}：
            </label>
            <input
                ref={_ref} // if you want to use auto focus when error happen, you neet to use _ref to translate ref
                className={showMsg ? 'base-error-foucs' : '' }
                onChange={onChange}
                name={name}
                {...rest}
            />
            {
                showMsg && 
                <span>{msgChildren}</span>
            }
        </div>
    )
}

export default InputWithMsg
