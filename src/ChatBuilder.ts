import { z } from "zod";
import { F } from "ts-toolbelt";
import OpenAI from "openai";
import { Chat } from "./Chat";
import { User, Assistant, System } from "./ChatHelpers";
import { ExtractArgs, ExtractChatArgs, TypeToZodShape, ReplaceChatArgs } from "./types";

export class ChatBuilder<
  TMessages extends
    | []
    | [...OpenAI.Chat.CreateChatCompletionRequestMessage[], OpenAI.Chat.CreateChatCompletionRequestMessage],
  TExpectedInput extends ExtractChatArgs<TMessages, any>
> {
  constructor(public messages: TMessages) {}

  addInputValidation<
    TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>
  >(): ChatBuilder<TMessages, TSTypeValidator> {
    return new ChatBuilder(this.messages) as any;
  }

  User<TUserText extends string | null>(
    str: TUserText
  ): ChatBuilder<
    [...TMessages, { role: "user"; content: TUserText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TUserText>
  > {
    return new ChatBuilder([...this.messages, User(str)]) as any;
  }

  System<TSystemText extends string | null>(
    str: TSystemText
  ): ChatBuilder<
    [...TMessages, { role: "system"; content: TSystemText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TSystemText>
  > {
    return new ChatBuilder([...this.messages, System(str)]) as any;
  }

  Assistant<TAssistantText extends string | null>(
    str: TAssistantText
  ): ChatBuilder<
    [...TMessages, { role: "assistant"; content: TAssistantText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TAssistantText>
  > {
    return new ChatBuilder([...this.messages, Assistant(str)]) as any;
  }

  // legacy purposes
  assistant = this.Assistant;
  user = this.User;
  system = this.System;

  addZodInputValidation<TShape extends TExpectedInput>(
    shape: TypeToZodShape<TShape>
  ) {
    const zodValidator = z.object(shape as any);
    return new (class extends ChatBuilder<TMessages, TShape> {
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
