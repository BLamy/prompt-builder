import { z, ZodType } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const ToolType = z.enum(["query", "mutation"])
export type ToolType = z.infer<typeof ToolType>


export class Tool<
  TName extends string,
  TType extends "query" | "mutation",
  const TExpectedInput extends { [key: string]: string },
  TExpectedOutput
> {
  constructor(
    public name: TName,
    public description: string,
    public type: TType,
    public use: (input: TExpectedInput) => TExpectedOutput,
    public input?: ZodType<TExpectedInput>,
    public output?: ZodType<TExpectedOutput>,
  ) {}

  toJSONSchema() {
    if (!this.input) {
      throw new Error('Tool has no input schema. Please use ToolBuilder.addZodInputValidation to set.')
    }
    const schema = zodToJsonSchema(this.input) as any;
    delete schema.$schema;
    if (!schema.additionalProperties) delete schema.additionalProperties;
    return {
      name: this.name,
      description: this.description,
      parameters: schema,
    };
  }

  validateInput(args: unknown): args is TExpectedInput {
    if (!this.input) {
      throw new Error('Tool has no input schema. Please use ToolBuilder.addZodInputValidation to set.')
    }
    return this.input.safeParse(args).success
  }

  validateOutput(args: unknown): args is TExpectedOutput {
    if (!this.output) {
      throw new Error('Tool has no output schema. Please use ToolBuilder.addZodInputValidation to set.')
    }
    return this.output.safeParse(args).success
  }
}