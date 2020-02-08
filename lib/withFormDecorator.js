import _extends from "@babel/runtime/helpers/extends";
import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
//author du
import React from 'react';
import FormContext from './context';
import BuildValidationRules from './builtValidationRule';
/**
 * 当规则中同时有validate和builtValidate时，只会调用validate
 * @param {object} rule 验证规则
 * @param {any} value 需要验证的值
 */

var validate = function validate(rule, value) {
  var validate = rule.validate,
      builtValidate = rule.builtValidate,
      asyncValidate = rule.asyncValidate,
      errMsg = rule.errMsg,
      param = rule.param; // 保证传入参数符合要求

  var params = Array.isArray(param) ? [value].concat(_toConsumableArray(param)) : [value, param]; // 优先调用自定义验证方法

  if (validate && !validate.apply(void 0, _toConsumableArray(params))) return errMsg; // 调用内置验证方法

  if (builtValidate && BuildValidationRules[builtValidate] && !BuildValidationRules[builtValidate].apply(BuildValidationRules, _toConsumableArray(params))) return errMsg; // 异步验证

  if (asyncValidate) return {
    validateAsyncPromise: asyncValidate.apply(void 0, _toConsumableArray(params))
  };
  return null;
};

var Form = function Form(Cmp) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Form, _React$Component);

    function Form(props) {
      var _this;

      _classCallCheck(this, Form);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, props));
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

      _defineProperty(_assertThisInitialized(_this), "addField", function (name, field) {
        _this.allField[name] = field;
      });

      _defineProperty(_assertThisInitialized(_this), "validateField", function (rules, value) {
        if (Array.isArray(rules)) {
          for (var i = 0; i < rules.length; i++) {
            var retMsg = validate(rules[i], value);
            if (retMsg) return retMsg.validateAsyncPromise || Promise.resolve(retMsg);
          }
        } else if (_typeof(rules) === 'object') {
          // 支持直接给rule传一个对象
          var _retMsg = validate(rules, value);

          if (_retMsg) return _retMsg.validateAsyncPromise || Promise.resolve(_retMsg);
        }

        return Promise.resolve(null);
      });

      _defineProperty(_assertThisInitialized(_this), "validateFields", function (cb) {
        var allField = _this.allField;
        var ret = {},
            errMsg = null,
            ref = {};
        var validatedPromises = [];

        for (var field in allField) {
          var fieldRule = allField[field];
          var rules = fieldRule.rules,
              value = fieldRule.value,
              instance = fieldRule.instance;
          ret[field] = value;
          validatedPromises.push({
            instance: instance,
            result: _this.validateField(rules, value)
          });
        }

        Promise.all(validatedPromises.map(function (item) {
          return item.result;
        })).then(function (results) {
          for (var i = 0; i < results.length; i++) {
            if (results[i]) {
              var _instance = validatedPromises[i].instance;

              _instance.update();

              errMsg = results[i];
              ref = _instance.ref;
              break;
            }
          }
          /**
           * @param {string} retMsg 错误信息
           * @param {object} fields { username: { value, ...retNeedValue } }
           */


          cb(errMsg, ret, ref);
        });
      });

      _this.allField = Object.create(null);
      return _this;
    }

    _createClass(Form, [{
      key: "render",
      value: function render() {
        var context = {
          validateFields: this.validateFields,
          validateField: this.validateField,
          addField: this.addField,
          allField: this.allField
        };
        return React.createElement(FormContext.Provider, {
          value: context
        }, React.createElement(Cmp, _extends({}, this.props, {
          validateFields: this.validateFields,
          validateField: this.validateField
        })));
      }
    }]);

    return Form;
  }(React.Component), _defineProperty(_class, "defaultProps", {}), _defineProperty(_class, "propTypes", {}), _temp;
};

export default Form;