import { zodToJsonSchema } from 'zod-to-json-schema'
import { ZodSchema, z } from 'zod'

export class OpenAIFunctionBuilder<
  TFuncName extends string,
  TFuncDesc extends string | null,
  TZodSchema extends ZodSchema<any>
> {
    public parameters: TZodSchema
    public execFn: (args: z.infer<TZodSchema>) => string

  constructor(public name: TFuncName, public description?: TFuncDesc) {
    this.parameters = parameters;
    this.execFn = execFn;
  }

  run(args: z.infer<TZodSchema>) {
    return this.execFn(args) as z.BRAND<TFuncName>
  }

  toString() {
    return {
        name: this.name,
        description: this.description,
        parameters: zodToJsonSchema(this.parameters),
    };
  }
}

export default OpenAIFunction;
