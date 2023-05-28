import { z } from "zod";
import { F } from "ts-toolbelt";
import { ChatCompletionRequestMessage } from "openai";
import { Chat } from "./Chat";
import { user, assistant, system } from "./ChatHelpers";
import { ExtractArgs, ExtractChatArgs, TypeToZodShape } from "./types";

export class ChatBuilder<
  TMessages extends
    | []
    | [...ChatCompletionRequestMessage[], ChatCompletionRequestMessage],
  TExpectedInput extends ExtractChatArgs<TMessages, any>
> {
  constructor(public messages: TMessages) {}

  addInputValidation<
    TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>
  >(): ChatBuilder<TMessages, TSTypeValidator> {
    return new ChatBuilder(this.messages) as any;
  }

  user<TUserText extends string>(
    str: TUserText
  ): ChatBuilder<
    [...TMessages, { role: "user"; content: TUserText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TUserText>
  > {
    return new ChatBuilder([...this.messages, user(str)]) as any;
  }

  system<TSystemText extends string>(
    str: TSystemText
  ): ChatBuilder<
    [...TMessages, { role: "system"; content: TSystemText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TSystemText>
  > {
    return new ChatBuilder([...this.messages, system(str)]) as any;
  }

  assistant<TAssistantText extends string>(
    str: TAssistantText
  ): ChatBuilder<
    [...TMessages, { role: "assistant"; content: TAssistantText }],
    F.Narrow<TExpectedInput> & ExtractArgs<TAssistantText>
  > {
    return new ChatBuilder([...this.messages, assistant(str)]) as any;
  }

  addZodInputValidation<TShape extends TExpectedInput>(
    shape: TypeToZodShape<TShape>
  ) {
    const zodValidator = z.object(shape as any);
    return new (class extends ChatBuilder<TMessages, TShape> {
      validate(args: Record<string, any>): args is TShape {
        return zodValidator.safeParse(args).success;
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

  build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
  ) {
    return new Chat<TMessages, TSuppliedInputArgs>(
      this.messages as any,
      args
    ).toArray();
  }
}
