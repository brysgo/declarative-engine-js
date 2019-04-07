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
