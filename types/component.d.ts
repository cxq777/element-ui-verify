import Vue from 'vue';
export default class ElFormItemVerifyComponent extends Vue {
    static fieldChange: 'v' | 'clear';
    v?: string | Function;
    r?: string;
    space?: string;
    emptyMessage?: string;
    errorMessage?: string;
    alias?: string;
    watch: undefined;
    fieldChange?: string;
    onValidateMessageChanged(msg: string): void;
    onWatchChanged(): void;
    readonly _v: boolean;
    getRules(): any[];
    clearValidate(): void;
    onFieldChange(): void;
}
