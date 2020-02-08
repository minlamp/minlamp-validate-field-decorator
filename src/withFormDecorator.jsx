//author du

import React from 'react'
import FormContext from './context'
import BuildValidationRules from './builtValidationRule'

/**
 * 当规则中同时有validate和builtValidate时，只会调用validate
 * @param {object} rule 验证规则
 * @param {any} value 需要验证的值
 */
const validate = (rule, value) => {
    const {validate, builtValidate, asyncValidate, errMsg, param} = rule
    // 保证传入参数符合要求
    const params = Array.isArray(param) ? [value, ...param] : [value, param]
    // 优先调用自定义验证方法
    if (validate && !validate(...params)) return errMsg
    // 调用内置验证方法
    if (builtValidate &&  BuildValidationRules[builtValidate] && !BuildValidationRules[builtValidate](...params))
        return errMsg
    // 异步验证
    if (asyncValidate) return {validateAsyncPromise: asyncValidate(...params)}

    return null
}

const Form = Cmp => class Form extends React.Component{
    static defaultProps = {}
    static propTypes = {}

    constructor(props){
        super(props)
/**
 * example of allField:
 * [
 *      'username': {
 *          rules: [
 *              {
 *                  validate(value, ...rest){
 *                  return value !== rest[0]
 *              },
 *                  param: [-1]
 *                  message: 'can not be -1',
 *              },
 *              {   内置验证方法使用
 *                  builtValidate: 'max',
 *                  message: 'required'
 *              },
 *              {
 *                  // 处理异步验证
 *                  asyncValidate(value) {
 *                      return new Promise((resolve, reject) => {
 *                          setTimeout(() => {
 *                              resolve(true)
 *                          }, 1000)
 *                      })
 *                  }
 *              }
 *          ],
 *          value: ''
 *       }
 * 
 * ]
 * 
 */
        this.allField = Object.create(null)
    }

    addField= (name, field) => {
        this.allField[name] = field
    }
    /**
     * 验证一个field的所有rule
     * @param {array | object} rules
     * @param {any} value 输入元素的值
     * @return {promise} 返回一个promise作为结果，当所有的rule都符合时，resolve(null), 当有一个rule不符合就立刻resolve(errorMessage)
     */
    validateField= (rules, value) => {
        if (Array.isArray(rules)) {
            for (let i =0; i < rules.length; i++){
                const retMsg = validate(rules[i], value)
                if (retMsg)
                    return retMsg.validateAsyncPromise || Promise.resolve(retMsg)
            }
        } else if (typeof rules === 'object'){
            // 支持直接给rule传一个对象
            const retMsg = validate(rules, value)
            if (retMsg) return retMsg.validateAsyncPromise || Promise.resolve(retMsg)
        }
        return Promise.resolve(null)
    }
    /**
     * 验证所有的字段是否正确
     * @param {function} cb 验证后的回调函数，可以在里面执行些submit操作
     */
    validateFields= (cb) => {
        const allField = this.allField
        let ret = {}, errMsg = null, ref = {}
        const validatedPromises = []

        for (let field in allField){
            const fieldRule = allField[field]
            const {rules, value, instance} = fieldRule

            ret[field] = value
            
            validatedPromises.push({
                instance,
                result: this.validateField(rules, value)
            })
        }

        Promise.all(validatedPromises.map(item => item.result))
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                if (results[i]) {
                    const {instance} = validatedPromises[i]
                    instance.update()
                    errMsg = results[i]
                    ref = instance.ref
                    break
                }
            }

            /**
             * @param {string} retMsg 错误信息
             * @param {object} fields { username: { value, ...retNeedValue } }
             */
            cb(errMsg, ret, ref)
        })
    }

    render(){
        const context = {
            validateFields: this.validateFields,
            validateField: this.validateField,
            addField: this.addField, 
            allField: this.allField
        }

        return (
            <FormContext.Provider
                value={context}
            >
                <Cmp
                    {...this.props}
                    validateFields={this.validateFields}
                    validateField={this.validateField}
                />
            </FormContext.Provider>
        )
    }
}

export default Form
