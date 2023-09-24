import { z } from "zod";
import {
  ExtractArgs,
  ExtractArgsAsTuple,
  ReplaceArgs,
  ExtractChatArgs,
  ReplaceChatArgs,
} from "../types";

export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

type testReplaceArgs = [
  Expect<Equal<ReplaceArgs<"Tell me a joke", {}>, "Tell me a joke">>,
  Expect<
    Equal<
      ReplaceArgs<
        "Tell {{person}} a {{jokeType}} joke",
        { jokeType: "funny"; person: "Brett" }
      >,
      "Tell Brett a funny joke"
    >
  >,
  Expect<
    Equal<
      ReplaceArgs<
        "Tell {{person}} a {{jokeType}} joke",
        { jokeType: "funny" | "silly"; person: "Brett" | "Liana" }
      >,
      | "Tell Brett a funny joke"
      | "Tell Brett a silly joke"
      | "Tell Liana a funny joke"
      | "Tell Liana a silly joke"
    >
  >,
  Expect<
    Equal<
      ReplaceArgs<
        "Tell me a {{jokeType}} {{joke}}",
        { jokeType: "funny"; joke: "poem" }
      >,
      "Tell me a funny poem"
    >
  >,
];

type testExtractArgsAsTuple = [
  Expect<
    Equal<
      ExtractArgsAsTuple<"Tell {{person}} a {{jokeType}} joke">,
      ["person", "jokeType"]
    >
  >,
  Expect<
    Equal<ExtractArgsAsTuple<"Tell me a {{jokeType}} joke">, ["jokeType"]>
  >,
  Expect<
    Equal<
      ExtractArgsAsTuple<"Tell me a {{jokeType}} {{joke}}">,
      ["jokeType", "joke"]
    >
  >,
];
type fadsfsa = ExtractArgs<
  "Tell {{person}} a {{jokeType}} joke",
  { jokeType: number }
>;

type foo = ExtractArgs<
  "Tell {{person}} a {{jokeType}} joke",
  {
    person: string;
    jokeType: string;
  }
>;

type testExtractArgs = [
  Expect<
    Equal<
      ExtractArgs<
        "Tell {{person}} a {{jokeType}} joke",
        {
          person: string;
          jokeType: string;
        }
      >,
      { jokeType: string; person: string }
    >
  >,
  Expect<
    Equal<
      ExtractArgs<"Tell me a {{jokeType}} joke", { jokeType: "funny" | "dad" }>,
      { jokeType: "funny" | "dad" }
    >
  >,
  Expect<
    Equal<
      ExtractArgs<
        "Tell me a {{jokeType}} {{num}} {{joke}}",
        { jokeType: string; num: number; joke: string }
      >,
      { jokeType: string; num: number; joke: string }
    >
  >,
];

type testExtractChatArgs = [
  Expect<
    Equal<
      ExtractChatArgs<
        [
          { role: "system"; content: "foo {{bar}} test" },
          { role: "user"; content: "foo {{buzz}} test" },
        ]
      >,
      {
        bar: any;
        buzz: any;
      }
    >
  >,
  Expect<
    Equal<
      ExtractChatArgs<
        [
          { role: "system"; content: "foo {{bar}} test" },
          { role: "user"; content: "foo {{buzz}} test" },
        ],
        {
          bar: "fizz" | "buzz";
          buzz: number;
        }
      >,
      {
        bar: "fizz" | "buzz";
        buzz: number;
      }
    >
  >,
  Expect<
    Equal<
      ExtractChatArgs<
        [
          { role: "system"; content: "foo {{bar}} test" },
          { role: "user"; content: "foo {{buzz}} test" },
        ],
        {
          bar: "fizz" | "buzz";
        }
      >,
      {
        bar: "fizz" | "buzz";
        buzz: any;
      }
    >
  >,
];

type testReplaceChatArgs = [
  Expect<
    Equal<
      ReplaceChatArgs<
        Array<{
          role: "system";
          content: "Tell {{person}} a {{jokeType}} joke";
        }>,
        { jokeType: "funny"; person: "Brett" }
      >,
      Array<{ role: "system"; content: "Tell Brett a funny joke" }>
    >
  >,
  Expect<
    Equal<
      ReplaceChatArgs<
        Array<{
          role: "system";
          content: "Tell {{person}} a {{jokeType}} joke";
        }>,
        { jokeType: "funny" | "dad"; person: "Brett" }
      >,
      Array<{
        role: "system";
        content: "Tell Brett a funny joke" | "Tell Brett a dad joke";
      }>
    >
  >,
  Expect<
    Equal<
      ReplaceChatArgs<
        [
          { role: "system"; content: "foo {{bar}} test" },
          { role: "user"; content: "foo {{buzz}} test" },
        ],
        {
          bar: "test";
          buzz: "test2" | "test3";
        }
      >,
      [
        { role: "system"; content: "foo test test" },
        { role: "user"; content: "foo test2 test" | "foo test3 test" },
      ]
    >
  >,
];

// Required to have atleast 1 test
it("should pass", () => {
  expect(true).toBe(true);
});
