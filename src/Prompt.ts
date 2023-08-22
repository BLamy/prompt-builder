import { F } from "ts-toolbelt";
import { ExtractArgs, ReplaceArgs } from "./types";

export class Prompt<
  TPromptTemplate extends string | null,
  TSuppliedInputArgs extends ExtractArgs<TPromptTemplate, {}>
> {
  constructor(
    public template: TPromptTemplate,
    public args: F.Narrow<TSuppliedInputArgs>
  ) {}

  toString() {
    return Object.keys(this.args).reduce((acc, x) => {
      const args = this.args as TSuppliedInputArgs;
      const key = x as keyof TSuppliedInputArgs;
      return acc.replace(`{{${x}}}`, args[key] as string);
    }, this.template || "") as ReplaceArgs<TPromptTemplate, TSuppliedInputArgs>;
  }
}

export default Prompt;
