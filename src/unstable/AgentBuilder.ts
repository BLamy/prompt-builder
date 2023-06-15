import { z } from "zod";
import { F } from "ts-toolbelt";
import { ChatCompletionRequestMessage } from "openai";
import { Chat } from "../Chat";
import { user, assistant, system } from "../ChatHelpers";
import { ExtractArgs, ExtractChatArgs, TypeToZodShape, ReplaceChatArgs } from "../types";

export class AgentBuilder<
  TMessages extends
    | []
    | [...ChatCompletionRequestMessage[], ChatCompletionRequestMessage],
  TExpectedInput extends ExtractChatArgs<TMessages, any>
> {
  constructor(public messages: TMessages) {}

  addInputValidation<
    TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>
  >(): AgentBuilder<TMessages, TSTypeValidator> {
    return new AgentBuilder(this.messages) as any;
  }

  addOutputValidation<
    TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>
 >(): AgentBuilder<TMessages, TSTypeValidator> {

  user<TUserText extends string>(
    str: TUserText
  ): AgentBuilder<
    [...TMessages, { role: "user"; content: TUserText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TUserText>
  > {
    return new AgentBuilder([...this.messages, user(str)]) as any;
  }

  system<TSystemText extends string>(
    str: TSystemText
  ): AgentBuilder<
    [...TMessages, { role: "system"; content: TSystemText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TSystemText>
  > {
    return new AgentBuilder([...this.messages, system(str)]) as any;
  }

  assistant<TAssistantText extends string>(
    str: TAssistantText
  ): AgentBuilder<
    [...TMessages, { role: "assistant"; content: TAssistantText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TAssistantText>
  > {
    return new AgentBuilder([...this.messages, assistant(str)]) as any;
  }

  addZodInputValidation<TShape extends TExpectedInput>(
    shape: TypeToZodShape<TShape>
  ) {
    const zodValidator = z.object(shape as any);
    return new (class extends AgentBuilder<TMessages, TShape> {
      validate(args: Record<string, any>): args is TShape {
        return zodValidator.safeParse(args).success;
      }

      get type() {
        return this.messages as ReplaceChatArgs<TMessages, TShape>;
      }
    
      build<TSuppliedInputArgs extends TShape>(
        args: F.Narrow<TSuppliedInputArgs>
      ) {
        zodValidator.parse(args);
        return super.build(args);
      }
    })(this.messages);
  }

  validate(args: Record<string, any>): args is TExpectedInput {
    // Validate can only be called on a PromptBuilder with zod input validation
    return false;
  }

  get type() {
    return this.messages as ReplaceChatArgs<TMessages, TExpectedInput>;
  }

  build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
  ) {
    return new Chat<TMessages, TSuppliedInputArgs>(
      this.messages as any,
      args
    ).toArray();
  }
}
