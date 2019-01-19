import { RuleGetter } from './types'
export type RuleGetters = { [name: string]: RuleGetter }
const getters: RuleGetters = {}
function rule(): RuleGetters
function rule(name: string, getter?: RuleGetter): RuleGetter
function rule(name?: string, getter?: RuleGetter): any {
  if (!name) return getters
  // if (getters[name] && getter) throw Error(`the rule name '${name}' has been used`)
  if (getters[name] && getter) console.warn(`the rule name '${name}' has been override`)
  if (getter) getters[name] = getter
  return getters[name]
}
export default rule
