import { create } from "./";

const resolvers = {
  Tank: {
    oneFish: (obj, args) => {
      return `that was really good ${args[0]}`;
    },
    twoFish: (obj, args) => {
      return { fields: { redFish: args[0] } };
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
    fields: {
      oneFish: {
        arguments: ["fish food"]
      },
      twoFish: {
        arguments: ["food"],
        fields: {
          redFish: {}
        }
      }
    }
  });

  expect(result).toEqual({
    oneFish: "that was really good fish food",
    twoFish: {
      redFish: "that was double good food"
    }
  });
});

test("async usage", async () => {
  const execute = create(
    Object.assign({}, resolvers, {
      Tank: {
        ...resolvers.Tank,
        asyncFish: (obj, args) => {
          return Promise.resolve({ fields: { redFish: "async " + args[0] } });
        }
      }
    })
  );
  const result = await execute({
    fields: {
      oneFish: {
        arguments: ["fish food"]
      },
      twoFish: {
        arguments: ["food"],
        fields: {
          redFish: {}
        }
      },
      asyncFish: {
        arguments: ["eats"],
        fields: {
          redFish: {}
        }
      }
    }
  });

  expect(result).toEqual({
    asyncFish: {
      redFish: "async eats"
    },
    oneFish: "that was really good fish food",
    twoFish: {
      redFish: "that was double good food"
    }
  });
});
