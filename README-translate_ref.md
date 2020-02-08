# 如何实现支持ref转发的输入组件
<p>我们经常会有这种需求，当用户提交表单时，如果用户输入有错，可以自动focus到用户输错的元素上。
当表单字段比较少时，我们可以用React.createRef一个个搞定，但是当字段非常多，甚至需要拆封到多个子组件开发时就会非常麻烦，并且很难维护。
这时我们需要用支持ref转发的输入组件去实现。</p>
<p>
下面两个案例支持ref转发，和validate-field-decorator结合是解决上述场景的利器
</p>
<p>
被Field包裹的输入组件，除了常见的name, onchange, label, value等参数，还可以通过props获取三个比较特别的参数
</p>

- showMsg 当value值验证通过时，showMsg为false，否则为true
- msgChildren 当showMsg为true即value值验证不通过时，msgChildren即为不通过rule的errMsg
- _ref 当调用validateFields(err, fields, ref)方法时，其回调函数的第三个参数就是_ref,把它赋值在输入元素上，当验证不通过时，回调函数获取的ref就是报错的输入元素

### 案例
- 支持转发ref的Input组件

```jsx
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
```

- 支持转发ref的Radio组件

```jsx

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

```
