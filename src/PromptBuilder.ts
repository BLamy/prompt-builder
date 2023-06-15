import { z } from "zod";
import { Type } from "arktype";
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
    return new ZodPromptBuilder(this.template, shape);
  }

  addArkTypeInputValidation<TShape extends TExpectedInput>(
    shape: Type<TShape>
  ) {
    return new ArkTypePromptBuilder(this.template, shape);
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

class ZodPromptBuilder<
  TPromptTemplate extends string,
  TExpectedInput extends ExtractArgs<TPromptTemplate, {}>
> extends PromptBuilder<TPromptTemplate, TExpectedInput> {
  constructor(
    public template: TPromptTemplate,
    public shape: TypeToZodShape<TExpectedInput>
  ) {
    super(template);
  }
  validate(args: Record<string, any>): args is TExpectedInput {
    const zodValidator = z.object(this.shape as any);
    return zodValidator.safeParse(args).success;
  }

  get type() {
    return this.template as ReplaceArgs<TPromptTemplate, TExpectedInput>;
  }

  build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
  ) {
    const zodValidator = z.object(this.shape as any);
    zodValidator.parse(args);
    return new Prompt(this.template, args).toString();
  }
}

class ArkTypePromptBuilder<
  TPromptTemplate extends string,
  TExpectedInput extends ExtractArgs<TPromptTemplate, {}>
> extends PromptBuilder<TPromptTemplate, TExpectedInput> {
  constructor(
    public template: TPromptTemplate,
    public shape: Type<TExpectedInput>
  ) {
    super(template);
  }
  validate(args: Record<string, any>): args is TExpectedInput {
    try {
      this.shape(args);
      return true;
    } catch (e) {
      return false;
    }
  }

  get type() {
    return this.template as ReplaceArgs<TPromptTemplate, TExpectedInput>;
  }

  build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
  ) {
    const { problems } = this.shape(args);
    if (problems?.summary) {
      throw new Error(problems.summary);
    }
    return new Prompt(this.template, args).toString();
  }
}
