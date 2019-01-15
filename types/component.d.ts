import Vue from 'vue';
export default class ElFormItemVerifyComponent extends Vue {
    static fieldChange: 'v' | 'clear';
    verify?: string | Function;
    v?: string | Function;
    require?: string;
    r?: string;
    space?: string;
    emptyMessage?: string;
    errorMessage?: string;
    alias?: string;
    watch: undefined;
    fieldChange?: string;
    onValidateMessageChanged(msg: string): void;
    onWatchChanged(): void;
    readonly _verify: boolean;
    getRules(): any[];
    clearValidate(): void;
    onFieldChange(): void;
}
