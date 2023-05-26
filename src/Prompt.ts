import { ExtractArgs, ReplaceArgs } from "./types";

export class Prompt<
  TPromptTemplate extends string,
  const TSuppliedInputArgs extends ExtractArgs<TPromptTemplate, {}>
> {
  constructor(
    public template: TPromptTemplate,
    public args: TSuppliedInputArgs
  ) {}

  toString() {
    return Object.keys(this.args).reduce((acc, x) => {
      return acc.replace(`{{${x}}}`, this.args[x as keyof typeof this.args]);
    }, this.template) as ReplaceArgs<TPromptTemplate, TSuppliedInputArgs>;
  }
}

export default Prompt;
