const getters = {};
function rule(name, getter) {
    if (!name)
        return getters;
    // if (getters[name] && getter) throw Error(`the rule name '${name}' has been used`)
    if (getters[name] && getter)
        console.warn(`the rule name '${name}' has been override`);
    if (getter)
        getters[name] = getter;
    return getters[name];
}
export default rule;
