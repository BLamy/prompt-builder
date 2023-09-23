import { z } from "zod";

type Query<TArgs extends z.ZodType<any>, TReturns extends z.ZodType<any>> = (fn: (args: z.infer<TArgs>) => z.infer<TReturns>) => z.infer<TReturns>;

const ai = {
  // Code that wraps zod functions such that .implement is typedefed as .query and .mutation
  function: {
    input: <TArgs extends z.ZodType<any>>(expectedInputArgs: TArgs) => ({
      output: <TReturns extends z.ZodType<any>>(expectedOutputArgs: TReturns) => ({
        query: (fn: <T extends z.infer<TArgs>>(args: T) => Query<T, z.infer<TReturns>>) => {
            return (asdf: z.infer<TArgs>) => expectedOutputArgs.brand('query').parse(fn(expectedInputArgs.parse(asdf)))
        },
        mutation: (fn: (args: z.infer<TArgs>) => z.infer<TReturns>) => ({
            implement: fn as unknown as z.ZodBranded<z.infer<TReturns>, "Mutation">,
        }),
      }),
    }),
  },
  router: <T extends Record<string, any>>(x: T) => x,
};
// MARK: Create the virtual machine configuration and instantiate the virtual machine.

// Usage
const aiRouter = ai.router({
  countCharacters: ai.function.input(z.string()).output(z.number())
    .query((x) => {
      return x.trim().length;
    }),

  updateCharacters: ai.function.input(z.string()).output(z.string())
    .mutation((x) => {
      return x.trim().length + "";
    }),
});
