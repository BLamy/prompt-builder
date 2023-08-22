import { zodToJsonSchema } from 'zod-to-json-schema'
import { ZodSchema, z } from 'zod'

export class OpenAIFunction<
  TFuncName extends string,
  TFuncDesc extends string | null,
  TZodSchema extends ZodSchema<any>
> {
    public name: TFuncName
    public description: TFuncDesc
    public parameters: TZodSchema
    public execFn: (args: z.infer<TZodSchema>) => string

  constructor({
    name,
    description,
    parameters,
    execFn
  }: {
     name: TFuncName,
     description: TFuncDesc,
     parameters: TZodSchema,
     execFn: (args: z.infer<TZodSchema>) => string
  }) {
    this.name = name;
    this.description = description;
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
