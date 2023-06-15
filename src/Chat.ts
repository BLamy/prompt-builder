import { F } from "ts-toolbelt";
import { ChatCompletionRequestMessage } from "openai";
import { PromptBuilder } from "./PromptBuilder";
import { ExtractArgs, ExtractChatArgs, ReplaceChatArgs } from "./types";

export class Chat<
  TMessages extends
    | []
    | [...ChatCompletionRequestMessage[], ChatCompletionRequestMessage],
  TSuppliedInputArgs extends ExtractChatArgs<TMessages, {}>
> {
  constructor(
    public messages: F.Narrow<TMessages>,
    public args: F.Narrow<TSuppliedInputArgs>
  ) {}

  toArray() {
    return (this.messages as TMessages).map((m) => ({
      role: m.role,
      content: new PromptBuilder(m.content)
        .addInputValidation<ExtractArgs<typeof m.content, typeof this.args>>()
        .build(this.args),
    })) as ReplaceChatArgs<typeof this.messages, typeof this.args>;
  }

  toString() {
    return JSON.stringify(this.toArray());
  }
}
