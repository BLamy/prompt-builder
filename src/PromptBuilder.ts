import { z, ZodType } from "zod";
import { Prompt } from "./Prompt";
import { ExtractArgs } from "./types";

export class PromptBuilder<
  TPromptTemplate extends string,
  TExpectedInput extends ExtractArgs<TPromptTemplate, {}>
> {
  constructor(protected template: TPromptTemplate) {}

  addInputValidation<
    TSTypeValidator extends ExtractArgs<TPromptTemplate, TSTypeValidator>
  >(): PromptBuilder<TPromptTemplate, TSTypeValidator> {
    return new PromptBuilder(this.template) as any;
  }

  addZodInputValidation<TZodSchema extends ZodType<TExpectedInput>>(
    schema: TZodSchema
  ): PromptBuilder<TPromptTemplate, z.infer<TZodSchema>> {
    return new (class extends PromptBuilder<TPromptTemplate, z.infer<TZodSchema>> {
      isValidArgs(args: Record<string, any>): args is z.infer<TZodSchema>{
        schema.parse(args);
        return true;
      }
      
      build<const TSuppliedInputArgs extends z.infer<TZodSchema>>(args: TSuppliedInputArgs) {
        schema.parse(args);
        return super.build(args);
      }
    })(this.template);
  }

  isValidArgs(args: Record<string, any>): args is TExpectedInput {
    // Validate can only be called on a PromptBuilder with zod input validation
    return false;
  }

  build<const TSuppliedInputArgs extends TExpectedInput>(
    args: TSuppliedInputArgs
  ) {
    return new Prompt<TPromptTemplate, TSuppliedInputArgs>(this.template, args)
      .toString();
  }
}
