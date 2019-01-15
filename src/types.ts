export type RuleGetter = (ruleVal?: any) => object
export type ErrorMessageTemplate = {
  number: string,
  int: string,
  maxLength: string,
  minLength: string,
  regex: string,
  phone: string,
  email: string,
  empty: string,
  [name: string]: string
}
