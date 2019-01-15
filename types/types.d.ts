export declare type RuleGetter = (ruleVal?: any) => object;
export declare type ErrorMessageTemplate = {
    require: string;
    number: string;
    int: string;
    maxLength: string;
    minLength: string;
    regex: string;
    phone: string;
    email: string;
    [name: string]: string;
};
