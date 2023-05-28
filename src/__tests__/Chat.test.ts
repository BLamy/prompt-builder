import { strict as assert } from "node:assert";
import { Chat } from "../Chat";
import { system, user, assistant } from "../ChatHelpers";
import { Equal, Expect } from "./types.test";

describe("Chat", () => {
  it("should allow empty array", () => {
    const chat = new Chat([], {}).toArray();
    type test = Expect<Equal<typeof chat, []>>;
    assert.deepEqual(chat, []);
  });

  it("invalid args should throw an error", () => {
    const chat = new Chat(
      [
        // ^?
        user("Tell me a {{jokeType}} joke"),
      ],
      // @ts-expect-error
      {}
    ).toArray();
    type test = Expect<
      Equal<typeof chat, [{ role: "user"; content: `Tell me a ${any} joke` }]>
    >;
  });

  it("should NOT allow empty args when they are expected", () => {
    const chat = new Chat(
      [
        //     ^?
        user(`Tell me a {{jokeType}} joke`),
      ],
      {
        jokeType: "funny" as const,
      }
    ).toArray();
    const usrMsg = user("Tell me a funny joke");
    //     ^?
    type test = Expect<Equal<typeof chat, [typeof usrMsg]>>;
    assert.deepEqual(chat, [usrMsg]);
  });

  it("should allow chat of all diffent types", () => {
    const chat = new Chat(
      [
        // ^?
        user(`Tell me a {{jokeType1}} joke`),
        assistant(`{{var2}} joke?`),
        system(`joke? {{var3}}`),
      ],
      {
        jokeType1: "funny",
        var2: "foo",
        var3: "bar",
      } as const
    ).toArray();
    const usrMsg = user("Tell me a funny joke");
    const astMsg = assistant("foo joke?");
    const sysMsg = system("joke? bar");
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });

  it("should allow chat of all diffent types with no args", () => {
    const chat = new Chat(
      [
        // ^?
        user(`Tell me a joke`),
        assistant(`joke?`),
        system(`joke?`),
      ],
      {}
    ).toArray();
    const usrMsg = user("Tell me a joke");
    const astMsg = assistant("joke?");
    const sysMsg = system("joke?");
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });
});
