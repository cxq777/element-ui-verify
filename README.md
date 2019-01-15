# element-ui-verify-modify
所有版权归原作者
https://github.com/aweiu/element-ui-verify

## 安装
```
npm install element-ui-verify-modify
```
## 使用
### 环境
`vue版本：^2.3.0`
`element-ui版本：>=1.1.1`
`webpack模块环境`
### 一，安装
```
import Vue from 'vue'
import elementUI from 'element-ui'
import elementUIVerify from 'element-ui-verify-modify'

// 这里注意必须得先use elementUI
Vue.use(elementUI)
Vue.use(elementUIVerify)
```
### 二，在el-form-item上配置校验规则
```
<template>
  <div class="hello">
    <h1>validater</h1>
    <p></p>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="标题" prop="title" r :max="5">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" r phone>
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v email>
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="整数" prop="int" v int>
        <el-input v-model="ruleForm.int"></el-input>
      </el-form-item>
      <el-form-item label="数字" prop="num" v number>
        <el-input v-model="ruleForm.num"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age" v :int-min="1" :int-max="200">
        <el-input v-model="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="人数" prop="peopleCount" v :int-min="0">
        <el-input v-model="ruleForm.peopleCount"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="amount" r number>
        <el-input v-model="ruleForm.amount"></el-input>
      </el-form-item>
      <el-form-item label="QQ号" prop="qq" v qq>
        <el-input v-model="ruleForm.qq"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        // title: "",
        // phone: "",
        // email: ""
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
```


## 默认支持的校验规则
* require（r）：必填
* number: 校验是否为数字
* number-max: 校验是否为数字，并且最大值为max
* number-int: 校验是否为数字，并且最大值为min
* int: 校验是否为整数
* int-max: 校验是否为整数，并且最大值为max
* int-min: 校验是否为整数，并且最大值为min
* max：校验最大长度
* min：校验最小长度
* regex：正则表达式
* 
* phone: 校验是否为手机号
* email: 校验是否为电子邮件地址


## 重要选项说明
### v
校验规则开始标志，除 “require”规则以外的规则必须以“v” 开头

### r
必填

## 插件的默认校验不通过提示模版
```
{
  number: '{alias}应为数字',
  int: '{alias}应为整数',
  maxLength: '{alias}最长{maxLength}个字符',
  minLength: '{alias}最短{minLength}个字符',
  max: '{alias}最大为{max}',
  min: '{alias}最小为{min}',
  regex: '{alias}格式不正确',
  phone: '请输入正确的手机号',
  email: '请输入正确的邮箱',
  empty: '请填写{alias}'
}
```
## 常见问题
**为什么不把prop配置项干掉？每次都要写校验规则都要写它好烦！**

我也烦。但本插件是基于ElementUI的，所以很多地方会受到原始校验机制的限制，还要尽可能不对它产生影响。比如这个prop选项，如果把它干掉，会影响到el-form的校验，因为ElementUI以prop作为uid来存储校验队列

**如何切换校验类型？比如某个输入框可能输入手机号也可能输入邮箱**
```
<el-form-item prop="prop" verify phone v-if="isPhone"></el-form-item>
<el-form-item prop="prop" verify email v-else></el-form-item>
```
在规则变化不多的情况下也可以这样（该种方式切换类型时会立即触发校验）
```
<el-form-item prop="prop" verify :phone="isPhone ? true : undefined" :email="isPhone ? undefined : true"></el-form-item>
```

## 后话
由于本插件的校验选项是基于VueProp，有如下缺点：

* 随着ElementUI的更新，未来有可能会和它的某些新增选项产生冲突
* 难以做到按照校验规则的书写顺序来执行校验，目前的大顺序是：空检测 > 通用规则 > 自定义校验方法。不过该条的影响不是很大，现有规则下的大部分场景不需要考虑规则顺序

