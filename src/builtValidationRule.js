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

export default BuildValidationRule
