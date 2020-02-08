# validate-field-decorator
<h3>简单好用的表单验证工具</h3>

### Features
- 使用简单
- 可以应对各种复杂场景
- 提供ref,方便foucs到报错元素

[![Build Status](https://travis-ci.com/jsweber/easycode-validateFieldDecorator.svg?branch=master)](https://travis-ci.com/jsweber/easycode-validateFieldDecorator)

[English](./README-en_US.md)

# 1. 安装

```sh
npm install --save validate-field-decorator
```

Then use it.

# 2. 使用案例
```js
import React from 'react'
import {Form, Field} from 'validate-field-decorator'

const InputWithMsg = props => {
    const {
        showMsg=false, // Field传给当前组件的prop, 当rules中的某条规则验证不通过时，showMsg为true，全部验证通过为false
        msgChildren='no message', // Field传给当前组件的prop, 当rules中的某条规则验证不通过时，msgChildren即为该rule的errMsg
        _ref, // Field传给当前组件的prop， 详情参考 6.QA
        onChange,  // Field封装后返回的函数，Field需要监听值变化
        // 对于以下prop，Field没有经过任何改动，直接转发
        name,
        required, 
        ...rest
        } = props

    return (
        <div>
            <label>
                {
                    required && 
                    <i style={{color: 'red'}}>*</i>
                }
                {name}
            </label>
            <input
            // if you want to use auto focus when error happen, you neet to use _ref to translate ref
                ref={_ref}
                onChange={onChange}
                {...rest}
            />
            {
                showMsg && 
                <span>{msgChildren}</span>
            }
        </div>
    )
}

const InputWithValidate = Field(InputWithMsg)

class App extends React.Component{

    state= {
        data: {
            username: 'Lee',
            password: '123456'
        }
    }

    onSubmit= () => {
        // validateFields is from Form
        const {validateFields} = this.props

        validateFields((err, fields, ref) => {
			if (err) {
                // do something when error happens
                ref.current && ref.current.focus()
			}else {
                // submit data
                // post('url', this.state.data)
			}
		})
    }

    changeValue= field => val => {
        const {data} = this.state
        this.setState({
            data: {
                ...data,
                [field]: val
            }
        })
    }

    render(){
        const {data} = this.state

        return (
            <div>
                <InputWithValidate
                    name="username"
                    required
                    value={data.username}
                    onChange= {this.changeValue('username')}
                    rules={{
                        builtValidate: 'required', // Built-in Validation
                        errMsg: 'required'
                    }}
                />

                <InputWithValidate
                    name="password"
                    required
                    value={data.password}
                    onChange= {this.changeValue('password')}
                    // multipe validater rules
                    rules={[
                        {
                            builtValidate: 'required',
                            errMsg: 'required'
                        },
                        {
                            validate(value){
                                return /^\d*$/.test(value)
                            },
                            errMsg: 'must be number'
                        }
                    ]}
                />

                <button onClick={this.onSubmit}>submit</button>
            </div>
        )
    }
}

export default Form(App)

```
#### [页面效果](https://jsweber.github.io/easycode-validateFieldDecorator/)
#### [完整案例代码](https://github.com/jsweber/easycode-validateFieldDecorator/blob/master/example/base/Base.jsx)
#### [如何实现支持ref转发的输入组件](./README-translate_ref.md)

# 3. Props
```js
    // Form和Field理解成装饰器或者高阶组件都可以
    import {Form, Field} from 'validate-field-decorator'
    const WrapperedForm = Form(MyForm)
    const WrapperedInput = Field(MyInput)
```
### MyForm's props from Form
- validateFields 验证所有字段的规则，使用见案例

### MyInput's props from Field
参数详情[如何实现支持ref转发的输入组件](./README-translate_ref.md)

### WrapperedForm
没有必传的参数，可以根据自己的需要设置prop

### WrapperedInput
- name @param{stringc | number} 必传且唯一，作为需要验证字段的key值
- rules @param{object | array} 必传，字段验证规则，当只有一条规则时可以直接传一个对象，当有多条规则时，用数组，
- value @param{number | string | boolean} 必传，作为input的value值
- onChange @param{function }必传，作为input的change事件的监听函数
- debounce @param{number} 可选，防抖的时间，单位毫秒

# 4.rule
- validate @param{function} 自定义验证函数，同步验证
- asyncValidate @param{function} 支持异步验证的函数
- builtValidate @param{string} 使用内置验证函数
- message @param{string} 作为验证不通过时的报错信息
- param @param{array} 可选，作为validate , builtValidate, asyncValidate 额外参数

#### 自定义同步验证函数
```js
    {
        validate(value, ...rest){
            return value !== rest[0]
        }
        param: [-1]
        message: 'can not be -1',
    }
```
#### 内置验证方法使用
```js
   {
        builtValidate: 'max',
        param: [10], // 当参数只有一个时，可以直接赋值10
        message: 'value must smaller than 10'
   }
```

#### 异步验证
```js
    asyncValidate(value){
        return new Promise( resolve => {
            setTimeout(() => {
                if (value === 'ok') {
                    // 异步验证成功
                    resolve()
                } else {
                    // 异步验证失败, resolve传错误信息
                    resolve('must be ok')
                }
            }, 500)
        })
    }
```

# 5. Built-in Validation
```js

const BuildValidationRule = {

    required(value){
        return value !== ''
    },

    isNumber(value) {
        return typeof value === 'number' && !Number.isNaN(value)
    },

    isString(value){
        return typeof value === 'string'
    },

    max(value, maxNumber){
        return this.isNumber(Number(value)) && value <= maxNumber
    },

    min(value, minNumber) {
        return this.isNumber(Number(value)) && value >= minNumber
    }
}

```

# 6. Q&A
#### 1.为什么不像elementUI那样把rules集中到Form上
validateFieldDecorator是为了解决页面有大量input元素需要验证而诞生的。
当页面有大量input（包括 checkbox, radio等），以至于开发者不得不分很多组件去实现时，
如果在Form返回的父组件上去统一设置rules(一个由name作为键名，验证规则为键值的对象)，还需要在每个组件上设置name，不利于解耦和多人合作。
所以validateFieldDecorator设计成用Form提供的<strong>validateFields</strong>方法统一验证，不需要关心子组件设置了哪些表单字段和验证规则，
同时利用[refs转发](https://react.docschina.org/docs/forwarding-refs.html)，实现自动提供出错的input元素。

#### 2. 如何实现validateFieldDecorator方法调用时，获取验证不通过的元素
在使用Field时我们会如下调用
```js
 const InputWithValidation = Field(MineInput)
```
MineInput组件经过Field包装后，通过props可以得到一个_ref参数，把它传给你想定位元素的ref上，详情参照[如何实现支持ref转发的输入组件](./README-translate_ref.md)。

# 7. 可运行的npm命令
### npm run dev
运行开发环境
浏览器访问http://localhost:8707
更改src和example内代码后，保存即可查看效果

### npm run build:min
打包并压缩代码

### npm run build:full
打包代码，代码不压缩

### npm test
运行测试

### npm lint
检查代码规范
