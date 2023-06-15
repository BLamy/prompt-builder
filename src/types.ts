import { z } from "zod";
import { ChatCompletionRequestMessage } from "openai";

export type ReplaceArgs<
  TPromptTemplate extends string | undefined,
  TArgs extends Record<string, any>
> = TPromptTemplate extends `${infer TStart}{{${infer TDataType}}}${infer TRest}`
  ? TRest extends `${string}{{${string}}}` | `${string}{{${string}}}${string}`
    ? `${TStart}${TArgs[TDataType]}${ReplaceArgs<TRest, TArgs>}`
    : `${TStart}${TArgs[TDataType]}${TRest}`
  : TPromptTemplate;

export type ExtractArgsAsTuple<TPromptTemplate extends string | undefined> =
  TPromptTemplate extends `${string}{{${infer TDataType}}}${infer TRest}`
    ? TRest extends `${string}{{${string}}}` | `${string}{{${string}}}${string}`
      ? [TDataType, ...ExtractArgsAsTuple<TRest>]
      : [TDataType]
    : [];

export type ExtractArgs<
  TPromptTemplate extends string | undefined,
  TSTypeValidator = ExtractArgs<TPromptTemplate, {}>
> = {
  [K in ExtractArgsAsTuple<TPromptTemplate>[number] as K]: K extends keyof TSTypeValidator
    ? TSTypeValidator[K]
    : any;
};

export type TypeToZodShape<T> = [T] extends [string | number | boolean]
  ? z.Schema<T>
  : {
      [K in keyof T]: TypeToZodShape<T[K]>;
    };

export type ReplaceChatArgs<TMessages, TArgs extends Record<string, any>> = {
  [K in keyof TMessages]: TMessages[K] extends ChatCompletionRequestMessage
    ? {
        role: TMessages[K]["role"];
        content: ReplaceArgs<TMessages[K]["content"], TArgs>;
      }
    : never;
};

export type ExtractChatArgs<
  TMessages,
  TSTypeValidator = ExtractChatArgs<TMessages, {}>
> = ExtractArgs<
  TMessages extends ChatCompletionRequestMessage[]
    ? TMessages[number]["content"]
    : never,
  TSTypeValidator
>;
