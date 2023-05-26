import { PromptBuilder } from "./PromptBuilder";
import { ChatCompletionRequestMessage } from "openai"
import { ExtractArgs, ExtractChatArgs, ReplaceChatArgs } from "./types";

export class Chat<
  TMessages extends [] | [...ChatCompletionRequestMessage[], ChatCompletionRequestMessage],
  const TArgs extends ExtractChatArgs<TMessages, {}>
> {
  constructor(protected messages: TMessages, protected args: TArgs) {}

  toArray() {
    return this.messages.map((m) => ({
      role: m.role,
      content: new PromptBuilder(m.content)
        .addInputValidation<ExtractArgs<typeof m.content, TArgs>>()
        .build(this.args),
    })) as ReplaceChatArgs<TMessages, TArgs>;
  }

  toString() {
    return JSON.stringify(this.toArray());
  }
}
