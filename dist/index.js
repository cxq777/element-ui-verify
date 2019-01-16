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
        const component = { props };
        // 监听prop变化，触发校验
        component.watch = {};
        component.watch[_name] = function () {
            if (this.v !== undefined && this.prop)
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
    // 文本长度
    exp.addRule({ name: 'length', type: Number }, length => ({
        len: length,
        message: exp.getErrorMessage('length', length)
    }));
    // 最小文本长度
    exp.addRule({ name: 'minLength', type: Number }, minLength => ({
        min: minLength,
        message: exp.getErrorMessage('minLength', minLength)
    }));
    // 数字类型
    exp.addRule('number', () => ({ type: 'number', message: exp.getErrorMessage('number') }));
    // gt
    exp.addRule({ name: 'gt', type: Number }, gt => [
        exp.getRule('number')(),
        {
            validator(rule, val, callback) {
                if (val <= gt)
                    callback(Error(exp.getErrorMessage('gt', gt)));
                else
                    callback();
            }
        }
    ]);
    // gte
    exp.addRule({ name: 'gte', type: Number }, gte => [
        exp.getRule('number')(),
        { type: 'number', min: gte, message: exp.getErrorMessage('gte', gte) }
    ]);
    // lt
    exp.addRule({ name: 'lt', type: Number }, lt => [
        exp.getRule('number')(),
        {
            validator(rule, val, callback) {
                if (val >= lt)
                    callback(Error(exp.getErrorMessage('lt', lt)));
                else
                    callback();
            }
        }
    ]);
    // lte
    exp.addRule({ name: 'lte', type: Number }, lte => [
        exp.getRule('number')(),
        { type: 'number', max: lte, message: exp.getErrorMessage('lte', lte) }
    ]);
    // 整数类型
    exp.addRule('int', () => ({ type: 'integer', message: exp.getErrorMessage('int') }));
    // 最多小数位
    exp.addRule({ name: 'maxDecimalLength', type: Number }, maxDecimalLength => [
        exp.getRule('number')(),
        {
            validator(rule, val, callback) {
                const decimal = val.toString().split('.')[1];
                if (decimal && decimal.length > maxDecimalLength)
                    callback(Error(exp.getErrorMessage('maxDecimalLength', maxDecimalLength)));
                else
                    callback();
            }
        }
    ]);
    // 手机号 https://github.com/aweiu/element-ui-verify/issues/24
    exp.addRule('phone', () => ({
        pattern: /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|6[67]|7[^249\D]|8\d|9[189])\d{8}$/,
        message: exp.getErrorMessage('phone')
    }));
    // 邮箱
    exp.addRule('email', () => ({ type: 'email', message: exp.getErrorMessage('email') }));
    // 6位数字验证码
    exp.addRule('verifyCode', () => ({
        pattern: /^\d{6}$/,
        message: exp.getErrorMessage('verifyCode')
    }));
}
export default exp;
