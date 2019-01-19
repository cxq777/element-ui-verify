import { VueConstructor } from 'vue';
import { PropOptions } from 'vue/types/options';
import { RuleGetter, ErrorMessageTemplate } from './types';
export interface VerifyRulePropOptions extends PropOptions {
    name: string;
}
export declare type Rule = {
    name: string | VerifyRulePropOptions;
    getter: RuleGetter;
};
declare const exp: {
    install(Vue: VueConstructor<any>, options: {
        errorMessageTemplate?: ErrorMessageTemplate | undefined;
        fieldChange?: "v" | "clear" | undefined;
        rules?: [Rule] | undefined;
    }): void;
    addRule(name: string | VerifyRulePropOptions, getter: RuleGetter): RuleGetter;
    getRule(name: string): RuleGetter;
    getErrorMessage(name: string, templateData?: any): string;
};
export default exp;
