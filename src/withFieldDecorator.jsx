//author du

import React from 'react'
import PropTypes from 'prop-types'
import FormContext from './context'
import omit from 'omit'

export const getEventValue = e => e.target ? e.target.value : e

const Field = Cmp => {

    return class FormItem extends React.PureComponent{
        static contextType = FormContext

        static defaultProps = {
            name: '',
            rules: [],
            debounce: 60
        }

        static propTypes = {
            name: PropTypes.string.isRequired,
            rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
            debounce: PropTypes.number
        }

        state = {
            showMsg: false,
            errMsg: ''
        }

        constructor(props) {
            super(props)
            this.ref = React.createRef()
            this.timer = null
        }

        componentDidUpdate() {
            this.addRule(this.props.value)
        }

        componentDidMount() {
            this.addRule(this.props.value)
        }

        addRule= value => {
            const {addField} = this.context
            const {name, rules} = this.props
            addField(name, {
                rules,
                value,
                instance: {
                    ref: this.ref,
                    update: () => {
                        this.onWrapperdChange(value)
                    }
                }
            })
        }

        debounceValidate= (rules, value) => {
            if (this.timer) clearTimeout(this.timer)

            this.timer = setTimeout(() => {
                this.context.validateField(rules, value).then(errMsg => {
                    this.setState({
                        errMsg,
                        showMsg: !!errMsg
                    })
                })
                this.timer = null
            }, this.props.debounce)
        }

        onWrapperdChange= e => {
            const {rules, onChange} = this.props
            const value = getEventValue(e)

            onChange(value)
            this.addRule(value)
            this.debounceValidate(rules, value)
        }

        render(){
            const {errMsg, showMsg} = this.state
            const itemProps = omit([
                'onChange',
                'rules'
            ], this.props)
            
            return (
                <Cmp
                    _ref={this.ref}
                    {...itemProps}
                    onChange = {this.onWrapperdChange}
                    showMsg={showMsg}
                    msgChildren={errMsg}
                />
            )
        }
    }
}

export default Field
