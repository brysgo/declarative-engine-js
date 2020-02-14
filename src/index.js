const defaultResolver = cur => obj => obj[cur];

const isPromise = subject => !!subject && typeof subject.then == "function";

export default resolvers => {
  const execute = (obj, path) => {
    path = path || [];
    let type = resolvers.typeFromObj(obj, path);
    if (!type || !resolvers[type]) {
      if (
        typeof obj === "string" ||
        typeof obj === "number" ||
        typeof obj === "boolean" ||
        typeof obj === "undefined" ||
        obj === null
      )
        return obj;
      if (Array.isArray(obj))
        return obj.map((x, i) => execute(x, [...path, i]));
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
        resolverResult.then(res => (acc[cur] = execute(res, [...path, cur])));
      } else {
        acc[cur] = execute(resolverResult, [...path, cur]);
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
