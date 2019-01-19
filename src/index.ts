import rule from './rule'
import Component from './component'
import errorMessage from './error-message'
import defaultErrorMessageTemplate from './error-message-template'
import { VueConstructor } from 'vue'
import { PropOptions } from 'vue/types/options'
import { RuleGetter, ErrorMessageTemplate } from './types'

export interface VerifyRulePropOptions extends PropOptions {
  name: string
}
export type Rule = { name: string | VerifyRulePropOptions, getter: RuleGetter }


let installed = false
let ElFormItemComponent: VueConstructor
const exp = {
  install(
    Vue: VueConstructor<any>,
    options: {
      errorMessageTemplate?: ErrorMessageTemplate,
      fieldChange?: 'clear' | 'v',
      rules?: [Rule]
    }
  ) {
    if (installed) return
    installed = true
    ElFormItemComponent = Vue.component('ElFormItem')
    if (!ElFormItemComponent) throw Error('please install element-ui first')
    Object.assign(defaultErrorMessageTemplate, options.errorMessageTemplate)
    errorMessage.setTemplate(defaultErrorMessageTemplate)
    Component.fieldChange = options.fieldChange || 'v'
    ElFormItemComponent.mixin(Component)
    init(options.rules)
  },
  addRule(
    name: string | VerifyRulePropOptions,
    getter: RuleGetter
  ): RuleGetter {
    if (!installed) throw Error('please install me')
    const props: any = {}
    if (typeof name === 'string') props[name] = {}
    else props[name.name] = name
    const _name = typeof name === 'string' ? name : name.name
    // console.log(_name)
    const component: any = { props }
    // 监听prop变化，触发校验
    component.watch = {}
    component.watch[_name] = function () {
      if ((this.v !== undefined || this.r !== undefined) && (this as any).prop) (this as any).validate('')
    }
    ElFormItemComponent.mixin(component)
    return rule(_name, getter)
  },
  getRule(name: string): RuleGetter {
    return rule(name)
  },
  getErrorMessage(name: string, templateData?: any): string {
    return errorMessage.get(name, templateData)
  }
}

function init(rules?: [Rule]) {
  // number 数字类型
  // exp.addRule('number', () => ({ type: 'number', message: exp.getErrorMessage('number') }))
  exp.addRule('number', () => ({
    pattern: /(^[-]?[1-9]\d*\.?\d*$|[-]?0\.\d*[1-9]\d*$)|(^0$)/,
    message: exp.getErrorMessage('number'),
    // transform(value: any) {
    //   console.log(1, value)
    //   return (value)
    // }
  }))
  exp.addRule('num', () => (exp.getRule('number')()))

  // int 整数类型
  // exp.addRule('int', () => ({ type: 'integer', message: exp.getErrorMessage('int') }))
  exp.addRule('int', () => ({
    pattern: /(^-?[1-9]\d*$)|(^0$)/,
    message: exp.getErrorMessage('int')
  }))

  // max
  exp.addRule({ name: 'max', type: Number }, maxLength => ({
    max: maxLength,
    message: exp.getErrorMessage('maxLength', maxLength)
  }))

  // min
  exp.addRule({ name: 'min', type: Number }, minLength => ({
    min: minLength,
    message: exp.getErrorMessage('minLength', minLength)
  }))

  // number-digit(num-d)
  exp.addRule({ name: 'numberDigit', type: Number }, digit => [
    exp.getRule('number')(),
    {
      pattern: new RegExp(`^\[-,0-9]+(\\.\\d{0,${digit}})?$`),
      message: exp.getErrorMessage('maxDigit', digit),
      // transform(value: any) {
      //   console.log(2, value)
      //   return (value)
      // }
    }
    // {
    //   validator(rule: any, val: number, callback: Function) {
    //     const decimal = val.toString().split('.')[1]
    //     if (decimal && decimal.length > digit) callback(Error(exp.getErrorMessage('maxDigit', digit)))
    //     else callback()
    //   }
    // }
  ])
  exp.addRule({ name: 'numD', type: Number }, digit => (exp.getRule('numberDigit')(digit)))

  // number-max
  exp.addRule({ name: 'numberMax', type: Number }, max => [
    exp.getRule('number')(),
    {
      type: 'number', max: max, message: exp.getErrorMessage('max', max),
      transform(value: any) {
        return parseFloat(value)
      }
    }
  ])
  exp.addRule({ name: 'numMax', type: Number }, max => (exp.getRule('numberMax')(max)))

  // number-min
  exp.addRule({ name: 'numberMin', type: Number }, min => [
    exp.getRule('number')(),
    {
      type: 'number', min: min, message: exp.getErrorMessage('min', min),
      transform(value: any) {
        return parseFloat(value)
      }
    }
  ])
  exp.addRule({ name: 'numMin', type: Number }, min => (exp.getRule('numberMin')(min)))


  // int-max
  exp.addRule({ name: 'intMax', type: Number }, max => [
    exp.getRule('int')(),
    {
      type: 'number', max: max, message: exp.getErrorMessage('max', max),
      transform(value: any) {
        return parseInt(value)
      }
    }
  ])
  // int-min
  exp.addRule({ name: 'intMin', type: Number }, min => [
    exp.getRule('int')(),
    {
      type: 'number', min: min, message: exp.getErrorMessage('min', min),
      transform(value: any) {
        return parseInt(value)
      }
    }
  ])

  //正则
  exp.addRule({ name: 'regex', type: String }, regex => ({
    pattern: new RegExp(regex),
    message: exp.getErrorMessage('regex', regex)
  }))
  // 邮箱
  exp.addRule('email', () => ({ type: 'email', message: exp.getErrorMessage('email') }))
  // 手机号
  exp.addRule('phone', () => ({
    pattern: /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|6[67]|7[^249\D]|8\d|9[189])\d{8}$/,
    message: exp.getErrorMessage('phone')
  }))
  // QQ
  exp.addRule('qq', () => ({
    pattern: /^[1-9]\d{2,15}$/,
    message: 'QQ格式不正确，正确格式为3至16位数字'
  }))

  if (rules) {
    rules.forEach(r => {

      exp.addRule(r.name, r.getter)
    })
  }
}

export default exp
