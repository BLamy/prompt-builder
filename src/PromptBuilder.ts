import { z } from "zod";
import { F } from "ts-toolbelt";
import { Prompt } from "./Prompt";
import { ExtractArgs, ReplaceArgs, TypeToZodShape } from "./types";

export class PromptBuilder<
  TPromptTemplate extends string,
  TExpectedInput extends ExtractArgs<TPromptTemplate, {}>
> {
  constructor(public template: TPromptTemplate) {}

  addInputValidation<
    TSTypeValidator extends ExtractArgs<TPromptTemplate, TSTypeValidator>
  >(): PromptBuilder<TPromptTemplate, TSTypeValidator> {
    return new PromptBuilder(this.template) as any;
  }

  addZodInputValidation<TShape extends TExpectedInput>(
    shape: TypeToZodShape<TShape>
  ) {
    const zodValidator = z.object(shape as any);
    return new (class extends PromptBuilder<TPromptTemplate, TShape> {
      validate(args: Record<string, any>): args is TShape {
        return zodValidator.safeParse(args).success;
      }

      get type() {
        return this.template as ReplaceArgs<TPromptTemplate, TShape>;
      }

      build<TSuppliedInputArgs extends TShape>(
        args: F.Narrow<TSuppliedInputArgs>
      ) {
        zodValidator.parse(args);
        return new Prompt(this.template, args).toString();
      }
    })(this.template);
  }

  validate(args: Record<string, any>): args is TExpectedInput {
    // Validate can only be called on a PromptBuilder with zod input validation
    return false;
  }

  get type() {
    return this.template as ReplaceArgs<TPromptTemplate, TExpectedInput>;
  }

  build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
  ) {
    return new Prompt(this.template, args).toString();
  }
}
