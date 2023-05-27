import { strict as assert } from "node:assert";
import { Prompt } from "../Prompt";
import { Equal, Expect } from "./types.test";

describe("Basic Prompt", () => {
  it("invalid args should throw TS error", () => {
    const prompt = new Prompt(
      "Tell me a {{jokeType}} joke",
      // @ts-expect-error
      {}
    );
  });

  it("should be able to create prompt with no variables", () => {
    const prompt = new Prompt("Tell me a joke", {}).toString();
    type test = Expect<Equal<typeof prompt, "Tell me a joke">>;
    assert.strictEqual(prompt, "Tell me a joke");
  });

  it("should be able to build a prompt", () => {
    const args = Object.freeze({
      // ^?
      jokeType: "funny",
    });
    const prompt = new Prompt("Tell me a {{jokeType}} joke", args).toString();
    type test = Expect<Equal<typeof prompt, "Tell me a funny joke">>;
    assert.strictEqual(prompt, "Tell me a funny joke");
  });

  it("should be able to build a prompt with a variable at the end", () => {
    const prompt = new Prompt("This is a {{test}}", {
      // ^?
      test: "foobar",
    } as const).toString();
    type test = Expect<Equal<typeof prompt, "This is a foobar">>;
    assert.strictEqual(prompt, "This is a foobar");
  });

  it("should be able to build a prompt with a variable at the beginning", () => {
    const prompt = new Prompt("{{fizzbuzz}} is a test", {
      // ^?
      fizzbuzz: "foobar" as const,
    }).toString();
    type test = Expect<Equal<typeof prompt, "foobar is a test">>;
    assert.strictEqual(prompt, "foobar is a test");
  });

  it("should be able to build a prompt with a multiple arguments of different types", () => {
    const prompt = new Prompt("{{str}}{{num}}{{bool}}", {
      // ^?
      str: "str",
      num: 2,
      bool: false,
    } as const).toString();
    type test = Expect<Equal<typeof prompt, "str2false">>;
    assert.strictEqual(prompt, "str2false");
  });
});
