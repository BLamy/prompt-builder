import { strict as assert } from "node:assert";
import { Chat } from "../Chat";
import { system, user, assistant } from "../ChatHelpers";
import { Equal, Expect } from "./types.test";
import { ToolBuilder } from "../ToolBuilder";
import { Tool } from '../Tool'
import { z } from "zod";

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
      {}
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

  const usrMsg = user("Tell me a funny joke");
  const astMsg = assistant("foo joke?");
  const sysMsg = system("joke? bar");
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
      }
    ).toArray();
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });

  it("should allow chat of all diffent types with no args", () => {
    const chat = new Chat([usrMsg, astMsg, sysMsg], {}).toArray();
    type test = Expect<
      Equal<typeof chat, [typeof usrMsg, typeof astMsg, typeof sysMsg]>
    >;
    assert.deepEqual(chat, [usrMsg, astMsg, sysMsg]);
  });

  it("should allow me to pass in tools", () => {
    const google = new ToolBuilder("google")
      .addZodInputValidation({ query: z.string() })
      .addZodOutputValidation(z.object({ results: z.array(z.string()) }))
      .query(({ query }) => {
        return {
          results: ["foo", "bar"],
        };
      });
    const wikipedia = new ToolBuilder("wikipedia")
    .addZodInputValidation({ page: z.string() })
    .addZodOutputValidation(z.object({ results: z.array(z.string()) }))
    .query(({ page }) => {
        return {
          results: ["foo", "bar"],
        };
      });

    const sendEmail = new ToolBuilder("sendEmail")
      .addZodInputValidation({
        to: z.string(),
        subject: z.string(),
        body: z.string(),
      })
      .addZodOutputValidation(z.object({ success: z.boolean() }))
      .mutation(({ to, subject, body }) => {
        return {
          success: true,
        };
      });
    const tools = {
      google,
      wikipedia,
      sendEmail,
    };
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
            google: Tool<
              "google",
              "query",
              {
                query: string;
              },
              {
                results: string[];
              }
            >;
            wikipedia: Tool<
              "wikipedia",
              "query",
              {
                page: string;
              },
              {
                results: string[];
              }
            >;
            sendEmail: Tool<
              "sendEmail",
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
