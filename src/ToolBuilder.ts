import { z, AnyZodObject, infer as _infer, ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TypeToZodShape } from "./types";
import { Tool } from "./Tool";

export class ToolBuilder<
  TName extends string,
  TType extends "query" | "mutation",
  const TExpectedInput extends Record<string, any>,
  TExpectedOutput 
> {
  constructor(
    public name: TName,
    public description: string = "",
    public type: TType = "query" as TType,
    public implementation?: (input: TExpectedInput) => TExpectedOutput
  ) {}

  addZodInputValidation<TShape extends TExpectedInput>(
    shape: TypeToZodShape<TShape>
  ): ToolBuilder<TName, TType, TShape, TExpectedOutput> {
    const zodValidator = z.object(shape as any);
    return new (class extends ToolBuilder<
      TName,
      TType,
      TShape,
      TExpectedOutput
    > {
      validate(args: unknown): args is TShape {
        return zodValidator.safeParse(args).success;
      }

      query(queryFunction: (input: TExpectedInput) => TShape) {
        // zodValidator.parse(args);
        return new Tool(this.name, "query", queryFunction);
      }

      mutation(mutationFunction: (input: TExpectedInput) => TShape) {
        return new Tool(this.name, "mutation", mutationFunction);
      }
    })(this.name, this.description, this.type, this.implementation);
  }

  addZodOutputValidation<TShape extends TExpectedOutput>(shape: ZodType<TShape>) {
    const zodValidator = z.object(shape as any);
    return new (class extends ToolBuilder<
      TName,
      TType,
      TExpectedInput,
      TShape
    > {
      validateOutput(output: unknown): output is TShape {
        return zodValidator.safeParse(output).success;
      }

      query(queryFunction: (input: TExpectedInput) => TShape) {
        return new Tool(this.name, this.description, "query", queryFunction);
      }
    
      mutation(mutationFunction: (input: TExpectedInput) => TShape) {
        return new Tool(this.name, this.description, "mutation", mutationFunction);
      }
    })(this.name, this.description, this.type, this.implementation as any);
  }

  query(queryFunction: (input: any) => any) {
    return new Tool(this.name, this.description, "query", queryFunction);
  }

  mutation(mutationFunction: (input: any) => any) {
    return new Tool(this.name, this.description, "mutation", mutationFunction);
  }

  toJSONSchema() {
    // // const fns: any[] = [];
    // //   const { params, ...rest } = this.implementation[key];
    const schema = zodToJsonSchema(
      z.object({
        name: z.string(),
      })
    );
    delete schema.$schema;
    // if (!schema.additionalProperties) delete schema.additionalProperties;
    // //   fns.push();
    return {
      name: this.name,
      parameters: schema,
    };
  }

  build<TShape extends TExpectedInput>(input: TShape) {
    return new Tool(this.name, this.description, this.type, this.implementation!);
  }
}
