import create from "./";

const resolvers = {
  Tank: {
    oneFish: obj => {
      return `that was really good ${obj.oneFish}`;
    },
    twoFish: obj => {
      return {
        redFish: obj.twoFish.arguments[0] + obj.twoFish.redFish
      };
    }
  },
  Fish: {
    arguments: () => false,
    redFish: obj => {
      return `that was double good ${obj.redFish}`;
    }
  },
  typeFromObj: obj => {
    if (obj && obj.oneFish) return "Tank";
    if (obj && obj.redFish) return "Fish";
  }
};

test("basic usage", () => {
  const execute = create(resolvers);
  const result = execute({
    oneFish: "fish food",
    twoFish: {
      arguments: ["food"],
      redFish: "!"
    }
  });

  expect(result).toEqual({
    oneFish: "that was really good fish food",
    twoFish: {
      redFish: "that was double good food!"
    }
  });
});

test("boolean usage", () => {
  const execute = create(
    Object.assign({}, resolvers, {
      Tank: {},
      Fish: {
        ...resolvers.Fish,
        booleanFish: ({ booleanFish }) => {
          return booleanFish;
        }
      }
    })
  );

  const result = execute({
    twoFish: {
      undefinedFish: undefined,
      nullFish: null,
      booleanFish: true,
      falseFish: false
    }
  });

  expect(result).toEqual({
    twoFish: {
      undefinedFish: undefined,
      nullFish: null,
      booleanFish: true,
      falseFish: false
    }
  });
});

test("async usage", async () => {
  const execute = create(
    Object.assign({}, resolvers, {
      Tank: {
        ...resolvers.Tank,
        asyncFish: obj => {
          return Promise.resolve({ redFish: "async " + obj.asyncFish.redFish });
        }
      }
    })
  );
  const result = await execute({
    oneFish: "fish food",
    twoFish: {
      arguments: ["food"],
      redFish: " :-)"
    },
    asyncFish: {
      redFish: "eats!!"
    }
  });

  expect(result).toEqual({
    asyncFish: {
      redFish: "that was double good async eats!!"
    },
    oneFish: "that was really good fish food",
    twoFish: {
      redFish: "that was double good food :-)"
    }
  });
});

test("readme example", () => {
  const executeDeclarativeEngine = create({
    Ball: {
      volume(obj) {
        return (4 / 3) * Math.PI * obj.radius ** 3;
      }
    },
    Basket: {
      height(obj) {
        return `${obj.height} ft`;
      }
    },
    typeFromObj: obj => obj.type
  });

  const result = executeDeclarativeEngine({
    type: "Court",
    ball: {
      type: "Ball",
      radius: 10,
      volume: true
    },
    basket: {
      type: "Basket",
      height: 12
    }
  });

  expect(result).toEqual({
    type: "Court",
    ball: {
      type: "Ball",
      radius: 10,
      volume: 4188.790204786391
    },
    basket: {
      type: "Basket",
      height: "12 ft"
    }
  });
});
