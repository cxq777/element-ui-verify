import { RuleGetter } from './types';
export declare type RuleGetters = {
    [name: string]: RuleGetter;
};
declare function rule(): RuleGetters;
declare function rule(name: string, getter?: RuleGetter): RuleGetter;
export default rule;
