import rules from './rules';
import Component from './component';
import errorMessage from './error-message';
import defaultErrorMessageTemplate from './error-message-template';
let installed = false;
let ElFormItemComponent;
const exp = {
    install(Vue, options = {}) {
        if (installed)
            return;
        installed = true;
        ElFormItemComponent = Vue.component('ElFormItem');
        if (!ElFormItemComponent)
            throw Error('please install element-ui first');
        errorMessage.setTemplate(options.errorMessageTemplate || defaultErrorMessageTemplate);
        Component.fieldChange = options.fieldChange || 'v';
        ElFormItemComponent.mixin(Component);
        init();
    },
    addRule(name, getter) {
        if (!installed)
            throw Error('please install me');
        const props = {};
        if (typeof name === 'string')
            props[name] = {};
        else
            props[name.name] = name;
        const _name = typeof name === 'string' ? name : name.name;
        console.log(_name);
        const component = { props };
        // 监听prop变化，触发校验
        component.watch = {};
        component.watch[_name] = function () {
            if ((this.v !== undefined || this.r !== undefined) && this.prop)
                this.validate('');
        };
        ElFormItemComponent.mixin(component);
        return rules(_name, getter);
    },
    getRule(name) {
        return rules(name);
    },
    getErrorMessage(name, templateData) {
        return errorMessage.get(name, templateData);
    }
};
function init() {
    // number 数字类型
    // exp.addRule('number', () => ({ type: 'number', message: exp.getErrorMessage('number') }))
    exp.addRule('number', () => ({
        pattern: /(^[-]?[1-9]\d*\.?\d*$|[-]?0\.\d*[1-9]\d*$)|(^0$)/,
        message: exp.getErrorMessage('number')
    }));
    // int 整数类型
    // exp.addRule('int', () => ({ type: 'integer', message: exp.getErrorMessage('int') }))
    exp.addRule('int', () => ({
        pattern: /(^-?[1-9]\d*$)|(^0$)/,
        message: exp.getErrorMessage('int')
    }));
    // max
    exp.addRule({ name: 'max', type: Number }, maxLength => ({
        max: maxLength,
        message: exp.getErrorMessage('maxLength', maxLength)
    }));
    // min
    exp.addRule({ name: 'min', type: Number }, minLength => ({
        min: minLength,
        message: exp.getErrorMessage('minLength', minLength)
    }));
    // max
    // exp.addRule({ name: 'max', type: Number }, max => (
    //   {
    //     validator(rule: any, val: any, callback: Function) {
    //       console.log(val, typeof val)
    //       if (typeof val === 'number') {
    //       } else {
    //       }
    //     }
    //   }
    // ))
    // number-max
    exp.addRule({ name: 'numberMax', type: Number }, max => [
        exp.getRule('number')(),
        { type: 'number', max: max, message: exp.getErrorMessage('max', max) }
    ]);
    // number-min
    exp.addRule({ name: 'numberMin', type: Number }, min => [
        exp.getRule('number')(),
        { type: 'number', min: min, message: exp.getErrorMessage('min', min) }
    ]);
    // int-max
    exp.addRule({ name: 'intMax', type: Number }, max => [
        exp.getRule('int')(),
        {
            type: 'number', max: max, message: exp.getErrorMessage('max', max),
            transform(value) {
                return parseInt(value);
            }
        }
    ]);
    // int-min
    exp.addRule({ name: 'intMin', type: Number }, min => [
        exp.getRule('int')(),
        {
            type: 'number', min: min, message: exp.getErrorMessage('min', min),
            transform(value) {
                return parseInt(value);
            }
        }
    ]);
    //正则
    exp.addRule({ name: 'regex', type: String }, regex => ({
        pattern: regex,
        message: exp.getErrorMessage('regex', regex)
    }));
    // 手机号
    exp.addRule('phone', () => ({
        pattern: /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|6[67]|7[^249\D]|8\d|9[189])\d{8}$/,
        message: exp.getErrorMessage('phone')
    }));
    // 邮箱
    exp.addRule('email', () => ({ type: 'email', message: exp.getErrorMessage('email') }));
}
export default exp;
