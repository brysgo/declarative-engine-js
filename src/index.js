const defaultResolver = obj => obj;

const isPromise = subject => typeof subject.then == "function";

export const create = resolvers => {
  const execute = obj => {
    let type = resolvers.typeFromObj(obj.fields);
    if (!type) {
      return obj;
    }

    if (typeof resolvers[type] === "function") {
      // short circuit field level resolution if a function if provided for the type
      return resolvers[type](obj.fields, obj.arguments);
    }

    const result = Object.keys(obj.fields).reduce((acc, cur) => {
      const resolver = (resolvers[type] || {})[cur] || defaultResolver;
      acc[cur] = execute(resolver(obj.fields, obj.fields[cur].arguments));
      return acc;
    }, {});
    return result;
  };

  return execute;
};
