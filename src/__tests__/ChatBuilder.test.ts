import { strict as assert } from "node:assert";
import { ZodError, z } from "zod";
import { ChatBuilder } from "../ChatBuilder";
import { user, system, assistant } from "../ChatHelpers";
import { Equal, Expect } from "./types.test";

describe("ChatBuilder", () => {
  it("invalid args should throw an error", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      user("Tell me a {{jokeType}} joke"),
      // @ts-expect-error
    ]).build({});
  });

  it("should allow empty array", () => {
    const chatBuilder = new ChatBuilder([]).build({});
    //     ^?
    type test = Expect<Equal<typeof chatBuilder, []>>;
    assert.deepEqual(chatBuilder, []);
  });

  it("should allow chainging of chat helpers", () => {
    const chatBuilder = new ChatBuilder([])
      //     ^?
      .user(`Tell me a {{jokeType}} joke`)
      .assistant(`{{var2}} joke?`)
      .system(`joke? {{var3}}`)
      .build({
        jokeType: "funny",
        var2: "foo",
        var3: "bar",
      } as const);
    const expectedContent = "Tell me a funny joke";
    const expectedContent2 = "foo joke?";
    const expectedContent3 = "joke? bar";
    type test = Expect<
      Equal<
        typeof chatBuilder,
        [
          { role: "user"; content: typeof expectedContent },
          { role: "assistant"; content: typeof expectedContent2 },
          { role: "system"; content: typeof expectedContent3 }
        ]
      >
    >;
    assert.deepEqual(chatBuilder, [
      { role: "user", content: expectedContent },
      { role: "assistant", content: expectedContent2 },
      { role: "system", content: expectedContent3 },
    ]);
  });
  it("should allow regular input validation after chaining", () => {
    const chatBuilder = new ChatBuilder([])
      //     ^?
      .user(`Tell me a {{jokeType}} joke`)
      .addInputValidation<{
        jokeType: "funny" | "silly";
      }>();
    const chat = chatBuilder.build({
      //     ^?
      jokeType: "funny",
    });

    const expectedContent = "Tell me a funny joke";
    type test = Expect<
      Equal<typeof chat, [{ role: "user"; content: typeof expectedContent }]>
    >;
    assert.deepEqual(chat, [{ role: "user", content: expectedContent }]);

    chatBuilder.build({
      // @ts-expect-error
      jokeType: "asdf",
    });
  });

  it("should allow adding zod validation after chaining", () => {
    const chatBuilder = new ChatBuilder([])
      //     ^?
      .user(`Tell me a {{jokeType}} joke`)
      .addZodInputValidation({
        jokeType: z.union([z.literal("funny"), z.literal("bad")]),
      });

    const chat = chatBuilder.build({
      //   ^?
      jokeType: "funny",
    });
    const expectedContent = "Tell me a funny joke";
    type test = Expect<
      Equal<typeof chat, [{ role: "user"; content: typeof expectedContent }]>
    >;
    assert.deepEqual(chat, [{ role: "user", content: expectedContent }]);

    assert.throws(
      () =>
        chatBuilder.build({
          // @ts-expect-error
          jokeType: "asdf",
        }),
      (error: ZodError) => {
        const issues = error.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path[0]]: issue.message,
          }),
          {}
        );
        assert.deepEqual(issues, {
          jokeType: "Invalid input",
        });
        return true;
      }
    );
  });

  it("Basic Single message Example", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      user(`Tell me a {{jokeType}} joke`),
    ]).build({
      jokeType: "funny" as const,
    });

    const expectedContent = "Tell me a funny joke";
    type test = Expect<
      Equal<
        typeof chatBuilder,
        [{ role: "user"; content: typeof expectedContent }]
      >
    >;
    assert.deepEqual(chatBuilder, [{ role: "user", content: expectedContent }]);
  });

  it("Multi argument Example", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      user(`Tell {{me}} {{num}} Jokes.`),
    ]).build({
      num: 1,
      me: "Brett",
    } as const);

    const expectedContent = "Tell Brett 1 Jokes.";
    type test = Expect<
      Equal<
        typeof chatBuilder,
        [{ role: "user"; content: typeof expectedContent }]
      >
    >;
    assert.deepEqual(chatBuilder, [{ role: "user", content: expectedContent }]);
  });

  it("Multi message Example", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      system(`You are a joke generator you only tell {{jokeType}} jokes`),
      user(`Tell {{me}} {{num}} Jokes.`),
      assistant(`Probably a bad joke a about atoms`),
    ]).build({
      jokeType: "funny",
      num: 1,
      me: "Brett",
    } as const);

    const expectedSystemContent =
      "You are a joke generator you only tell funny jokes";
    const expectedUserContent = "Tell Brett 1 Jokes.";
    const expectedAssistantContent = "Probably a bad joke a about atoms";

    type test = Expect<
      Equal<
        typeof chatBuilder,
        [
          { role: "system"; content: typeof expectedSystemContent },
          { role: "user"; content: typeof expectedUserContent },
          { role: "assistant"; content: typeof expectedAssistantContent }
        ]
      >
    >;
    assert.deepEqual(chatBuilder, [
      { role: "system", content: expectedSystemContent },
      { role: "user", content: expectedUserContent },
      { role: "assistant", content: expectedAssistantContent },
    ]);
  });

  it("Multi message Example with zod validation", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      system(`You are a joke generator you only tell {{jokeType}} jokes`),
      user(`Tell {{me}} {{num}} Jokes.`),
      assistant(`Probably a bad joke a about atoms`),
    ]).addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
      me: z.union([z.literal("Brett"), z.literal("Liana")]),
      num: z.number(),
    });

    const chat = chatBuilder.build({
      jokeType: "funny",
      num: 1,
      me: "Brett",
    } as const);

    const expectedSystemContent =
      "You are a joke generator you only tell funny jokes";
    const expectedUserContent = "Tell Brett 1 Jokes.";
    const expectedAssistantContent = "Probably a bad joke a about atoms";

    type test = Expect<
      Equal<
        typeof chat,
        [
          { role: "system"; content: typeof expectedSystemContent },
          { role: "user"; content: typeof expectedUserContent },
          { role: "assistant"; content: typeof expectedAssistantContent }
        ]
      >
    >;
    assert.deepEqual(chat, [
      { role: "system", content: expectedSystemContent },
      { role: "user", content: expectedUserContent },
      { role: "assistant", content: expectedAssistantContent },
    ]);

    assert.throws(
      () =>
        chatBuilder.build({
          // @ts-expect-error
          jokeType: "asdf",
          // @ts-expect-error
          num: "1",
          // @ts-expect-error
          me: "zxcv",
        }),
      (error: ZodError) => {
        const issues = error.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path[0]]: issue.message,
          }),
          {}
        );
        assert.deepEqual(issues, {
          jokeType: "Invalid input",
          num: "Expected number, received string",
          me: "Invalid input",
        });
        return true;
      }
    );
  });

  it("Multi message Example with input validation", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      system(`You are a joke generator you only tell {{jokeType}} jokes`),
      user(`Tell {{me}} {{num}} Jokes.`),
      assistant(`Probably a bad joke a about atoms`),
    ]).addInputValidation<{
      jokeType: "funny" | "silly";
      me: "Brett" | "Liana";
      num: number;
    }>();

    const chat = chatBuilder.build({
      // ^?
      jokeType: "funny",
      num: 1,
      me: "Brett",
    });

    const expectedSystemContent =
      "You are a joke generator you only tell funny jokes";
    const expectedUserContent = "Tell Brett 1 Jokes.";
    const expectedAssistantContent = "Probably a bad joke a about atoms";

    type test = Expect<
      Equal<
        typeof chat,
        [
          { role: "system"; content: typeof expectedSystemContent },
          { role: "user"; content: typeof expectedUserContent },
          { role: "assistant"; content: typeof expectedAssistantContent }
        ]
      >
    >;
    assert.deepEqual(chat, [
      { role: "system", content: expectedSystemContent },
      { role: "user", content: expectedUserContent },
      { role: "assistant", content: expectedAssistantContent },
    ]);

    chatBuilder.build({
      // @ts-expect-error
      jokeType: "asdf",
      // @ts-expect-error
      num: "1",
      // @ts-expect-error
      me: "zxcv",
    });
  });
  it("should be able to validate props for a ZodPromptBuilder", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      system(`You are a joke generator you only tell {{jokeType}} jokes`),
      user(`Tell {{me}} {{num}} Jokes.`),
      assistant(`Probably a bad joke a about atoms`),
    ]).addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
      me: z.union([z.literal("Brett"), z.literal("Liana")]),
      num: z.number(),
    });

    const args = {
      jokeType: "funny",
      num: 1,
      me: "Brett",
    };
    // @ts-expect-error
    chatBuilder.build(args);

    if (chatBuilder.validate(args)) {
      const chat = chatBuilder.build(args);
      type test = Expect<
        Equal<
          typeof chat,
          [
            {
              role: "system";
              content:
                | "You are a joke generator you only tell funny jokes"
                | "You are a joke generator you only tell silly jokes";
            },
            {
              role: "user";
              content:
                | `Tell Brett ${number} Jokes.`
                | `Tell Liana ${number} Jokes.`;
            },
            { role: "assistant"; content: "Probably a bad joke a about atoms" }
          ]
        >
      >;
    } else {
      throw new Error("Invalid args");
    }
  });

  it("validate props should fail if invalid args provided", () => {
    const chatBuilder = new ChatBuilder([
      // ^?
      system(`You are a joke generator you only tell {{jokeType}} jokes`),
      user(`Tell Jokes.`),
      assistant(`Probably a bad joke a about atoms`),
    ]).addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
    });

    const args = {
      jokeType: "any",
    };
    if (chatBuilder.validate(args)) {
      // CANNOT validate at runtime if only ts types provided
      throw new Error("Invalid args");
    }
  });
});
