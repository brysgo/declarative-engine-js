const defaultResolver = cur => obj => obj[cur];

const isPromise = subject => !!subject && typeof subject.then == "function";

export default resolvers => {
  const execute = (obj, path, ancestorTypes) => {
    path = path || [];
    ancestorTypes = ancestorTypes || [];
    let type = resolvers.typeFromObj(obj, path, ancestorTypes);
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
        return obj.map((x, i) =>
          execute(x, [...path, i], [...ancestorTypes, "[]"])
        );
    }

    if (typeof resolvers[type] === "function") {
      // short circuit field level resolution if a function if provided for the type
      return resolvers[type](obj);
    }

    const promises = [];
    const result = Object.keys(obj).reduce((acc, cur) => {
      const resolver = (resolvers[type] || {})[cur] || defaultResolver(cur);
      const resolverResult = resolver(obj);
      const newAncestorTypes = [...ancestorTypes, type];
      const newPath = [...path, cur];
      if (isPromise(resolverResult)) {
        promises.push(resolverResult);
        resolverResult.then(
          res => (acc[cur] = execute(res, newPath, newAncestorTypes))
        );
      } else {
        acc[cur] = execute(resolverResult, newPath, newAncestorTypes);
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
