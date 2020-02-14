const defaultResolver = cur => obj => obj[cur];

const isPromise = subject =>
  !!subject && typeof subject === "object" && typeof subject.then == "function";

export default resolvers => {
  const execute = obj => {
    let type = resolvers.typeFromObj(obj);
    if (!type || !resolvers[type]) {
      if (
        typeof obj === "string" ||
        typeof obj === "number" ||
        typeof obj === "boolean" ||
        typeof obj === "undefined" ||
        obj === null
      )
        return obj;
      if (Array.isArray(obj)) return obj.map(execute);
    }

    if (typeof resolvers[type] === "function") {
      // short circuit field level resolution if a function if provided for the type
      return resolvers[type](obj);
    }

    const promises = [];
    const result = Object.keys(obj).reduce((acc, cur) => {
      const resolver = (resolvers[type] || {})[cur] || defaultResolver(cur);
      const resolverResult = resolver(obj);
      if (isPromise(resolverResult)) {
        promises.push(resolverResult);
        resolverResult.then(res => (acc[cur] = execute(res)));
      } else {
        acc[cur] = execute(resolverResult);
      }
      return acc;
    }, {});
    if (promises.length === 0) {
      return result;
    } else {
      return Promise.all(promises).then(() => result);
    }
  };

  return execute;
};
