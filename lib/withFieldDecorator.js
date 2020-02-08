import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
//author du
import React from 'react';
import PropTypes from 'prop-types';
import FormContext from './context';
import omit from 'omit';
export var getEventValue = function getEventValue(e) {
  return e.target ? e.target.value : e;
};

var Field = function Field(Cmp) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(FormItem, _React$PureComponent);

    function FormItem(props) {
      var _this;

      _classCallCheck(this, FormItem);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FormItem).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "state", {
        showMsg: false,
        errMsg: ''
      });

      _defineProperty(_assertThisInitialized(_this), "addRule", function (value) {
        var addField = _this.context.addField;
        var _this$props = _this.props,
            name = _this$props.name,
            rules = _this$props.rules;
        addField(name, {
          rules: rules,
          value: value,
          instance: {
            ref: _this.ref,
            update: function update() {
              _this.onWrapperdChange(value);
            }
          }
        });
      });

      _defineProperty(_assertThisInitialized(_this), "debounceValidate", function (rules, value) {
        if (_this.timer) clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
          _this.context.validateField(rules, value).then(function (errMsg) {
            _this.setState({
              errMsg: errMsg,
              showMsg: !!errMsg
            });
          });

          _this.timer = null;
        }, _this.props.debounce);
      });

      _defineProperty(_assertThisInitialized(_this), "onWrapperdChange", function (e) {
        var _this$props2 = _this.props,
            rules = _this$props2.rules,
            onChange = _this$props2.onChange;
        var value = getEventValue(e);
        onChange(value);

        _this.addRule(value);

        _this.debounceValidate(rules, value);
      });

      _this.ref = React.createRef();
      _this.timer = null;
      return _this;
    }

    _createClass(FormItem, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.addRule(this.props.value);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.addRule(this.props.value);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$state = this.state,
            errMsg = _this$state.errMsg,
            showMsg = _this$state.showMsg;
        var itemProps = omit(['onChange', 'rules'], this.props);
        return React.createElement(Cmp, _extends({
          _ref: this.ref
        }, itemProps, {
          onChange: this.onWrapperdChange,
          showMsg: showMsg,
          msgChildren: errMsg
        }));
      }
    }]);

    return FormItem;
  }(React.PureComponent), _defineProperty(_class, "contextType", FormContext), _defineProperty(_class, "defaultProps", {
    name: '',
    rules: [],
    debounce: 60
  }), _defineProperty(_class, "propTypes", {
    name: PropTypes.string.isRequired,
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    debounce: PropTypes.number
  }), _temp;
};

export default Field;