import { ExtractArgs, ExtractArgsAsTuple, ReplaceArgs } from "../types";

export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
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
  >
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
  >
];
type fadsfsa = ExtractArgs<
  "Tell {{person}} a {{jokeType}} joke",
  { jokeType: number }
>;
//      ^?

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
  >
];

// Required to have atleast 1 test
it("should pass", () => {
  expect(true).toBe(true);
});
