import OpenAI from "openai";
import { PromptBuilder } from "./PromptBuilder";
import { ExtractArgs, ExtractChatArgs, ReplaceChatArgs } from "./types";
import { ToolBuilder } from "./ToolBuilder";
import { Tool, ToolType } from './Tool'

export class Chat<
  const ToolNames extends string,
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
    public tools = {} as Record<ToolNames, Tool<ToolNames, ToolType, any, any>>,
    public mustUseTool: boolean = false
  ) {}

  toJSONSchema() {
    const tools = Object.values(this.tools) as  Tool<ToolNames, ToolType, any, any>[];
    return tools.reduce((acc, t) => ({ ...acc, ...t.toJSONSchema()}), {})
  }

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
