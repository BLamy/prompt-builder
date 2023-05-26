import { z, ZodType } from "zod";
import { Chat } from "./Chat";
import { user, assistant, system } from "./ChatHelpers";
import { ChatCompletionRequestMessage } from "openai";
import { ExtractArgs, ExtractChatArgs } from "./types";

export class ChatBuilder<
  TMessages extends
    | []
    | [...ChatCompletionRequestMessage[], ChatCompletionRequestMessage],
  const TExpectedInput extends ExtractChatArgs<TMessages, any>
> {
  constructor(protected messages: TMessages) {}

  addInputValidation<
    TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>
  >(): ChatBuilder<TMessages, TSTypeValidator> {
    return new ChatBuilder(this.messages) as any;
  }

  user<TUserText extends string>(
    str: TUserText
  ): ChatBuilder<
    [...TMessages, { role: "user"; content: TUserText }],
    TExpectedInput & ExtractArgs<TUserText>
  > {
    return new ChatBuilder([...this.messages, user(str)]) as any;
  }

  system<TSystemText extends string>(
    str: TSystemText
  ): ChatBuilder<
    [...TMessages, { role: "system"; content: TSystemText }],
    TExpectedInput & ExtractArgs<TSystemText>
  > {
    return new ChatBuilder([...this.messages, system(str)]) as any;
  }

  assistant<TAssistantText extends string>(
    str: TAssistantText
  ): ChatBuilder<
    [...TMessages, { role: "assistant"; content: TAssistantText }],
    TExpectedInput & ExtractArgs<TAssistantText>
  > {
    return new ChatBuilder([...this.messages, assistant(str)]) as any;
  }

  addZodInputValidation<TZodSchema extends ZodType<TExpectedInput>>(
    schema: TZodSchema
  ): ChatBuilder<TMessages, z.infer<TZodSchema>> {
    return new (class ZodChatBuilder extends ChatBuilder<
      TMessages,
      z.infer<TZodSchema>
    > {
      validate(args: Record<string, any>): args is z.infer<TZodSchema> {
        schema.parse(args);
        return true;
      }

      build<const TSuppliedInputArgs extends z.infer<TZodSchema>>(
        args: TSuppliedInputArgs
      ) {
        schema.parse(args);
        return super.build(args);
      }
    })(this.messages);
  }

  validate(args: Record<string, any>): args is TExpectedInput {
    // Validate can only be called on a PromptBuilder with zod input validation
    return false;
  }

  build<const TSuppliedInputArgs extends TExpectedInput>(
    args: TSuppliedInputArgs
  ) {
    return new Chat<TMessages, TSuppliedInputArgs>(
      this.messages,
      args
    ).toArray();
  }
}
