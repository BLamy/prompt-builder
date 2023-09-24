import { strict as assert } from "node:assert";
import { Chat } from "../Chat";
import { system, user, assistant } from "../ChatHelpers";
import { Equal, Expect } from "./types.test";
import { ToolBuilder } from "../ToolBuilder";

describe("Chat", () => {
  it("should allow empty array", () => {
    const chat = new Chat([], {}, {}).toArray();
    type test = Expect<Equal<typeof chat, []>>;
    assert.deepEqual(chat, []);
  });

  it("invalid args should throw an error", () => {
    const chat = new Chat(
      [user("Tell me a {{jokeType}} joke")],
      // @ts-expect-error
      {},
    ).toArray();
    type test = Expect<
      Equal<typeof chat, [{ role: "user"; content: `Tell me a ${any} joke` }]>
    >;
  });

  it("should NOT allow empty args when they are expected", () => {
    const chat = new Chat([user(`Tell me a {{jokeType}} joke`)], {
      jokeType: "funny",
    }).toArray();
    const usrMsg = user("Tell me a funny joke");

    type test = Expect<Equal<typeof chat, [typeof usrMsg]>>;
    assert.deepEqual(chat, [usrMsg]);
  });

  it("should allow chat of all diffent types", () => {
    const chat = new Chat(
      [
        user(`Tell me a {{jokeType1}} joke`),
        assistant(`{{var2}} joke?`),
        system(`joke? {{var3}}`),
      ],
      {
        jokeType1: "funny",
        var2: "foo",
        var3: "bar",
      },
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
    const usrMsg = user("Tell me a joke");
    const astMsg = assistant("joke?");
    const sysMsg = system("joke?");

    const chat = new Chat([usrMsg, astMsg, sysMsg], {}).toArray();
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });

  it("should allow me to pass in tools", () => {
    const usrMsg = user("Tell me a joke");
    const astMsg = assistant("joke?");
    const sysMsg = system("joke?");
    const tools = {
      google: new ToolBuilder("google")
        .addInputValidation<{ query: string }>()
        .addOutputValidation<{ results: string[] }>()
        .query(({ query }) => {
          return {
            results: ["foo", "bar"],
          };
        }),
      wikipedia: new ToolBuilder("wikipedia")
        .addInputValidation<{ page: string }>()
        .addOutputValidation<{ results: string[] }>()
        .query(({ page }) => {
          return {
            results: ["foo", "bar"],
          };
        }),
      sendEmail: new ToolBuilder("sendEmail")
        .addInputValidation<{ to: string; subject: string; body: string }>()
        .addOutputValidation<{ success: boolean }>()
        .mutation(({ to, subject, body }) => {
          return {
            success: true,
          };
        }),
    } as const;

    const chat = new Chat([usrMsg, astMsg, sysMsg], {}, tools);

    type tests = [
      Expect<
        Equal<
          typeof chat,
          Chat<
            keyof typeof tools,
            [typeof usrMsg, typeof astMsg, typeof sysMsg],
            {}
          >
        >
      >,
      Expect<
        Equal<
          typeof tools,
          {
            readonly google: ToolBuilder<
              "query",
              {
                query: string;
              },
              {
                results: string[];
              }
            >;
            readonly wikipedia: ToolBuilder<
              "query",
              {
                page: string;
              },
              {
                results: string[];
              }
            >;
            readonly sendEmail: ToolBuilder<
              "mutation",
              {
                to: string;
                subject: string;
                body: string;
              },
              {
                success: boolean;
              }
            >;
          }
        >
      >
    ];
  });
});
