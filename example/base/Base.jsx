//author du

import React from 'react'
import {Form, Field} from '../../src/index'
import './style.css'
import InputWithMsg from '@common/InputWithMsg' // ../common/InputWithMsg
import RadioWithMsg from '@common/RadioWithMsg' // ../common/RadioWithMsg

const InputWithValidate = Field(InputWithMsg)
const RadioWithValidate = Field(RadioWithMsg)

class App extends React.Component{

    state= {
        data: {
            username: '',
            password: '',
            local: '',
            age: '',
            sex: ''
        }
    }

    onSubmit= () => {
        // validateFields is from Form
        const {validateFields} = this.props

        validateFields((err, fields, ref) => {
            console.log(fields)
			if (err) {
                // do something when error happens
                console.log(ref)
                ref.current && ref.current.focus()
			}else {
                // submit data
                // post('url', this.state.data)
                window.alert(JSON.stringify(fields))
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
            <div className="base-wrapper">
                <h2>base example</h2>
                <div className="base-field">
                    <span className="base-field-desc">1.required</span>
                    <InputWithValidate
                        name="username (required)"
                        value={data.username}
                        onChange= {this.changeValue('username')}
                        required
                        rules={{
                            builtValidate: 'required', // Built-in Validation
                            errMsg: 'required'
                        }}
                    />
                </div>
                
                <div className="base-field">
                    <span className="base-field-desc">2.required and value must be number</span>
                    <InputWithValidate
                        name="password"
                        type="password"
                        value={data.password}
                        onChange= {this.changeValue('password')}
                        required
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
                </div>
                <div className="base-field">
                    <span className="base-field-desc">3.async validate, value must be &#39;ok&#39;</span>
                    <InputWithValidate
                        name="local"
                        value={data.local}
                        onChange= {this.changeValue('local')}
                        required
                        debounce={300} // default 60
                        // async validate
                        rules={{
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
                        }}
                    />
                </div>
                <div className="base-field">
                    <span className="base-field-desc">4.age must be smaller than 35</span>
                    <InputWithValidate
                        name="age"
                        value={data.age}
                        onChange= {this.changeValue('age')}
                        required
                        rules={{
                            builtValidate: 'max',
                            param: 35,
                            errMsg: 'age must be smaller than 35'
                        }}
                    />
                </div>

                <div className="base-field">
                    <span className="base-field-desc">5.sex must be unkown</span>
                    <RadioWithValidate
                        name="sex"
                        value={data.sex}
                        onChange= {this.changeValue('sex')}
                        required
                        rules={{
                            validate(value){
                                return value === 'unkown'
                            },
                            errMsg: 'must be unkown'
                        }}
                    />
                </div>

                <button 
                    onClick={this.onSubmit}
                    className="base-submit-btn"
                >submit</button>
            </div>
        )
    }
}

export default Form(App)

