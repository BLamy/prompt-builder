export type ReplaceArgs<
  TPromptTemplate extends string,
  TArgs extends Record<string, any>
> = TPromptTemplate extends `${infer TStart}{{${infer TDataType}}}${infer TRest}`
  ? TRest extends `${string}{{${string}}}` | `${string}{{${string}}}${string}`
    ? `${TStart}${TArgs[TDataType]}${ReplaceArgs<TRest, TArgs>}`
    : `${TStart}${TArgs[TDataType]}${TRest}`
  : TPromptTemplate;

export type ExtractArgsAsTuple<TPromptTemplate extends string> =
  TPromptTemplate extends `${string}{{${infer TDataType}}}${infer TRest}`
    ? TRest extends `${string}{{${string}}}` | `${string}{{${string}}}${string}`
      ? [TDataType, ...ExtractArgsAsTuple<TRest>]
      : [TDataType]
    : [];

export type ExtractArgs<
  TPromptTemplate extends string,
  TSTypeValidator = ExtractArgs<TPromptTemplate, {}>
> = {
  [K in ExtractArgsAsTuple<TPromptTemplate>[number] as K]: K extends keyof TSTypeValidator
    ? TSTypeValidator[K]
    : any;
};
