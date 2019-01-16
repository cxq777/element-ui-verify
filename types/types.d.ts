export declare type RuleGetter = (ruleVal?: any) => object;
export declare type ErrorMessageTemplate = {
    number: string;
    int: string;
    maxLength: string;
    minLength: string;
    regex: string;
    phone: string;
    email: string;
    empty: string;
    [name: string]: string;
};
