import OpenAI from "openai";
import { PromptBuilder } from "./PromptBuilder";
import { ExtractArgs, ExtractChatArgs, ReplaceChatArgs } from "./types";

export class Chat<
  TMessages extends
    | []
    | [
        ...OpenAI.Chat.ChatCompletionMessageParam[],
        OpenAI.Chat.ChatCompletionMessageParam,
      ],
  const TSuppliedInputArgs extends ExtractChatArgs<TMessages, {}>,
> {
  constructor(
    public messages: TMessages,
    public args: TSuppliedInputArgs,
  ) {}

  toArray() {
    return this.messages.map((m) => ({
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
