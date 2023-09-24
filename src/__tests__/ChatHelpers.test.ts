import { Expect, Equal } from "./types.test";
import { system, user, assistant, dedent } from "../ChatHelpers";

describe("dedent", () => {
  it("When called as function string literal is maintained but type literal is not dedented like the actual value", () => {
    const dedented = dedent(`
            foo
            bar
        `);
    // This does not dedent the type. I found this was too expensive to do.
    // https://tinyurl.com/message-creators-literal-types
    type test = Expect<
      Equal<typeof dedented, "\n            foo\n            bar\n        ">
    >;
    expect(dedented).toBe("foo\nbar");
  });

  it("should dedent when called as tagged template literal but then be typed as string instead of a string literal", () => {
    const dedented = dedent`
            foo
            bar
        `;
    type test = Expect<Equal<typeof dedented, string | null>>;
    expect(dedented).toBe("foo\nbar");
  });

  it("should dedent with placeholders", () => {
    const dedented = dedent`
            foo
            ${"bar"}
        `;
    expect(dedented).toBe("foo\nbar");
  });
});

describe("Message Creation Helpers", () => {
  it("system as function call", () => {
    const systemMessage = system(`
            foo
            bar
        `);
    type test = Expect<
      Equal<
        typeof systemMessage,
        {
          role: "system";
          content: "\n            foo\n            bar\n        ";
        }
      >
    >;
    expect(systemMessage).toEqual({ role: "system", content: "foo\nbar" });
  });

  it("system as tagged template literal", () => {
    const systemMessage = system`
            foo
            bar
        `;
    type test = Expect<
      Equal<typeof systemMessage, { role: "system"; content: string | null }>
    >;
    expect(systemMessage).toEqual({ role: "system", content: "foo\nbar" });
  });

  it("user as function call", () => {
    const userMessage = user(`
            foo
            bar
        `);
    type test = Expect<
      Equal<
        typeof userMessage,
        {
          role: "user";
          content: "\n            foo\n            bar\n        ";
        }
      >
    >;
    expect(userMessage).toEqual({ role: "user", content: "foo\nbar" });
  });

  it("user as tagged template literal", () => {
    const userMessage = user`
            foo
            bar
        `;
    type test = Expect<
      Equal<typeof userMessage, { role: "user"; content: string | null }>
    >;
    expect(userMessage).toEqual({ role: "user", content: "foo\nbar" });
  });

  it("assistant as function call", () => {
    const assistantMessage = assistant(`
            foo
            bar
        `);
    type test = Expect<
      Equal<
        typeof assistantMessage,
        {
          role: "assistant";
          content: "\n            foo\n            bar\n        ";
        }
      >
    >;
    expect(assistantMessage).toEqual({
      role: "assistant",
      content: "foo\nbar",
    });
  });

  it("assistant as tagged template literal", () => {
    const assistantMessage = assistant`
            foo
            bar
        `;
    type test = Expect<
      Equal<
        typeof assistantMessage,
        { role: "assistant"; content: string | null }
      >
    >;
    expect(assistantMessage).toEqual({
      role: "assistant",
      content: "foo\nbar",
    });
  });
});
