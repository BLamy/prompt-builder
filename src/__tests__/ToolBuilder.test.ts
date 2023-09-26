import { ToolBuilder } from "../ToolBuilder";
import { Equal, Expect } from "./types.test";
import { z } from "zod";

describe("ToolBuilder", () => {
  describe("no args", () => {
    const noop = () => "";
    it("ToolBuilder should allow me to create a query tool with any args", () => {
      const noopQuery = new ToolBuilder("noop").query(noop);
      type tests = [
        Expect<
          Equal<
            typeof noopQuery,
            ToolBuilder<"noop", "query", Record<string, any>, unknown>
          >
        >
      ];
    });

    it("ToolBuilder should allow me to create a mutation tool with any args", () => {
      const noopMutation = new ToolBuilder("noop").mutation(noop);
      type tests = [
        Expect<
          Equal<
            typeof noopMutation,
            ToolBuilder<"noop", "mutation", Record<string, any>, unknown>
          >
        >
      ];
    });
  });

//   describe("specific args using typescript", () => {
//     it("Output as object mapping", () => {
//       const toolName = "fooToBar";
//       type Input = { foo: string };
//       type Output = { bar: string };
//       const fooToBar = new ToolBuilder(toolName)
//         .addInputValidation<Input>()
//         .addOutputValidation<Output>()
//         .query(((args) => ({ bar: "test" })) satisfies (obj: Input) => Output);

//       type tests = [
//         Expect<
//           Equal<
//             typeof fooToBar,
//             ToolBuilder<"fooToBar", "query", Input, Output>
//           >
//         >
//       ];
//     });

//     it("Input should throw type error for non object types", () => {
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<string>();
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<number>();
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<boolean>();
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<null>();
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<undefined>();
//       // @ts-expect-error
//       new ToolBuilder("toolName").addInputValidation<unknown>();
//     });

//     it("Output should accept any type", () => {
//       new ToolBuilder("toolName").addOutputValidation<string>();
//       new ToolBuilder("toolName").addOutputValidation<number>();
//       new ToolBuilder("toolName").addOutputValidation<boolean>();
//       new ToolBuilder("toolName").addOutputValidation<null>();
//       new ToolBuilder("toolName").addOutputValidation<undefined>();
//       new ToolBuilder("toolName").addOutputValidation<unknown>();
//     });

//     it("should throw type error if query function does not satisfy input/output types", () => {
//       new ToolBuilder("toolName")
//         .addInputValidation<{ foo: string }>()
//         .addOutputValidation<{ bar: string }>()
//         // @ts-expect-error
//         .query((args) => {
//           type test = Expect<Equal<typeof args, { foo: string }>>;
//           return { asdf: "test" };
//         });
//     });
//   });

  describe("addZodInputValidation", () => {
    it("Output as object mapping", () => {
      const toolName = "fooToBar";
      const fooToBar = new ToolBuilder(toolName)
        .addZodInputValidation({ foo: z.string() })
        .addZodOutputValidation(z.object({ bar: z.string() }))
        .query((args) => ({ bar: "test" }));

      type tests = [
        Expect<
          Equal<
            typeof fooToBar,
            Tool<"fooToBar", "query", { foo: string }, { bar: string }>
          >
        >
      ];
    });
  });
});
