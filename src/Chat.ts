import { PromptBuilder } from "./PromptBuilder";
import { ChatCompletionRequestMessage } from "openai";
import { ExtractArgs, ExtractChatArgs, ReplaceChatArgs } from "./types";
import { F } from "ts-toolbelt";

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
    return (this.messages as any[]).map((m: ChatCompletionRequestMessage) => ({
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
