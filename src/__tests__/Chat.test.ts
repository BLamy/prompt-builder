import { strict as assert } from "node:assert";
import { Chat } from "../Chat";
import { System, User, Assistant } from "../ChatHelpers";
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
        User("Tell me a {{jokeType}} joke"),
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
        User(`Tell me a {{jokeType}} joke`),
      ],
      {
        jokeType: "funny" as const,
      }
    ).toArray();
    const usrMsg = User("Tell me a funny joke");
    //     ^?
    type test = Expect<Equal<typeof chat, [typeof usrMsg]>>;
    assert.deepEqual(chat, [usrMsg]);
  });

  it("should allow chat of all diffent types", () => {
    const chat = new Chat(
      [
        // ^?
        User(`Tell me a {{jokeType1}} joke`),
        Assistant(`{{var2}} joke?`),
        System(`joke? {{var3}}`),
      ],
      {
        jokeType1: "funny",
        var2: "foo",
        var3: "bar",
      } as const
    ).toArray();
    const usrMsg = User("Tell me a funny joke");
    const astMsg = Assistant("foo joke?");
    const sysMsg = System("joke? bar");
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });

  it("should allow chat of all diffent types with no args", () => {
    const chat = new Chat(
      [
        // ^?
        User(`Tell me a joke`),
        Assistant(`joke?`),
        System(`joke?`),
      ],
      {}
    ).toArray();
    const usrMsg = User("Tell me a joke");
    const astMsg = Assistant("joke?");
    const sysMsg = System("joke?");
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });
});
