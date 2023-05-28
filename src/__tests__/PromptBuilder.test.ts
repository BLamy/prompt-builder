import { strict as assert } from "node:assert";
import { z, ZodError } from "zod";
import { PromptBuilder } from "../PromptBuilder";
import { Equal, Expect } from "./types.test";

describe("PromptBuilder", () => {
  it("should be able to create prompt with no variables", () => {
    const promptBuilder = new PromptBuilder("Tell me a joke");
    const prompt = promptBuilder.build({});
    type test = Expect<Equal<typeof prompt, "Tell me a joke">>;
    assert.strictEqual(prompt, "Tell me a joke");
  });

  it("should be able to build a basic prompt", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const prompt = promptBuilder.build({
      jokeType: "funny" as const,
    });
    type test = Expect<Equal<typeof prompt, "Tell me a funny joke">>;
    assert.strictEqual(prompt, "Tell me a funny joke");
  });

  it("should be able to build a prompt with multiple args of different types", () => {
    const promptBuilder = new PromptBuilder(
      "Tell {{me}} {{num}} {{jokeType}} {{bool}} joke"
    );
    const prompt = promptBuilder.build({
      jokeType: "funny",
      me: "Brett",
      num: 1,
      bool: true,
    } as const);
    type test = Expect<Equal<typeof prompt, "Tell Brett 1 funny true joke">>;
    assert.strictEqual(prompt, "Tell Brett 1 funny true joke");
  });
});

describe("PromptBuilder with input validation", () => {
  it("should be able to build a basic prompt", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const validatedPromptBuilder = promptBuilder.addInputValidation<{
      jokeType: "funny" | "silly";
    }>();
    const prompt = validatedPromptBuilder.build({
      jokeType: "funny",
    });
    type test = Expect<Equal<typeof prompt, "Tell me a funny joke">>;
    assert.strictEqual(prompt, "Tell me a funny joke");

    const invalidPrompt = validatedPromptBuilder.build({
      // @ts-expect-error Type '"bad"' is not assignable to type '"funny" | "silly"'
      jokeType: "bad",
    });
  });

  it("should be able to build a prompt with multiple args of different types", () => {
    const promptBuilder = new PromptBuilder(
      "Tell {{me}} {{num}} {{jokeType}} {{bool}} joke"
    );
    const validatedPromptBuilder = promptBuilder.addInputValidation<{
      jokeType: "funny" | "silly";
      me: "Brett" | "Liana";
      num: number;
      bool: boolean;
    }>();
    const prompt = validatedPromptBuilder.build({
      jokeType: "funny",
      me: "Brett",
      num: 1,
      bool: true,
    });
    type test = Expect<Equal<typeof prompt, "Tell Brett 1 funny true joke">>;
    assert.strictEqual(prompt, "Tell Brett 1 funny true joke");

    const invalidPrompt = validatedPromptBuilder.build({
      // @ts-expect-error Type '"bad"' is not assignable to type '"funny" | "silly"'
      jokeType: "bad",
      me: "Brett",
      num: 1,
      bool: true,
    });
  });
});

describe("PromptBuilder with input validation using Zod", () => {
  it("should be able to build a basic prompt", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const validatedPromptBuilder = promptBuilder.addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
    });
    const prompt = validatedPromptBuilder.build({
      jokeType: "funny",
    });
    type test = Expect<Equal<typeof prompt, "Tell me a funny joke">>;
    assert.strictEqual(prompt, "Tell me a funny joke");

    assert.throws(
      () => {
        const invalidPrompt = validatedPromptBuilder.build({
          // @ts-expect-error Type '"bad"' is not assignable to type '"funny" | "silly"'
          jokeType: "bad",
        });
      },
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

  it("should be able to build a prompt with multiple args of different types", () => {
    const promptBuilder = new PromptBuilder(
      "Tell {{me}} {{num}} {{jokeType}} {{bool}} joke"
    );
    const validatedPromptBuilder = promptBuilder.addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
      me: z.union([z.literal("Brett"), z.literal("Liana")]),
      num: z.number(),
      bool: z.boolean(),
    });
    const prompt = validatedPromptBuilder.build({
      jokeType: "funny",
      me: "Brett",
      num: 1,
      bool: true,
    });
    type test = Expect<Equal<typeof prompt, "Tell Brett 1 funny true joke">>;
    assert.strictEqual(prompt, "Tell Brett 1 funny true joke");
    assert.throws(
      () => {
        const invalidPrompt = validatedPromptBuilder.build({
          // @ts-expect-error Type '"bad"' is not assignable to type '"funny" | "silly"'
          jokeType: "bad",
          // @ts-expect-error Type '"test"' is not assignable to type '"Brett" | "Liana"'
          me: "test",
          // @ts-expect-error Type 'string' is not assignable to type 'number'
          num: "1",
          // @ts-expect-error Type 'string' is not assignable to type 'boolean'
          bool: "true",
        });
      },
      (error: ZodError) => {
        const issues = error.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path[0]]: issue.message,
          }),
          {}
        );
        assert.deepEqual(issues, {
          bool: "Expected boolean, received string",
          jokeType: "Invalid input",
          me: "Invalid input",
          num: "Expected number, received string",
        });
        return true;
      }
    );
  });

  it("should be able to validate props for a ZodPromptBuilder", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const validatedPromptBuilder = promptBuilder.addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
    });
    const args = {
      jokeType: "funny",
    };
    if (validatedPromptBuilder.validate(args)) {
      const prompt = validatedPromptBuilder.build(args);
      type test = Expect<
        Equal<typeof prompt, "Tell me a funny joke" | "Tell me a silly joke">
      >;
      assert.strictEqual(prompt, "Tell me a funny joke");
      return;
    }
    throw new Error("Invalid args");
  });

  it("should fail to validate props if no runtime zod validation provided", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const args = {
      jokeType: "any",
    };
    if (promptBuilder.validate(args)) {
      // CANNOT validate at runtime if only ts types provided
      throw new Error("Invalid args");
    }
  });

  it("validate props should fail if invalid args provided", () => {
    const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");
    const validatedPromptBuilder = promptBuilder.addZodInputValidation({
      jokeType: z.union([z.literal("funny"), z.literal("silly")]),
    });
    const args = {
      jokeType: "any",
    };
    if (validatedPromptBuilder.validate(args)) {
      validatedPromptBuilder.build(args);
      // CANNOT validate at runtime if only ts types provided
      throw new Error("Invalid args");
    }
    assert.throws(
      () => {
        // @ts-expect-error
        validatedPromptBuilder.build(args);
      },
      (error: ZodError) => {
        const issues = error.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path[0]]: issue.message,
          }),
          {}
        );
        assert.deepEqual(issues, { jokeType: "Invalid input" });
        return true;
      }
    );
  });
});
