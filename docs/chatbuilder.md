---
description: TODO WIP
---

# ChatBuilder

## ChatBuilder

The `ChatBuilder` class is designed to help in constructing chat conversations with validation. It provides a way to programmatically create chat messages with varying roles (user, system, assistant), input validation, and builds chat arrays.

The `ChatBuilder` constructor takes an array of `ChatCompletionRequestMessage` types, and an optional `TExpectedInput` which represents the expected input format for this chat.

The `ChatBuilder` provides methods for chaining actions, adding messages with various roles, adding input validation, and building the resulting chat.

### Methods

#### addInputValidation

Adds input validation to the ChatBuilder.

```typescript
addInputValidation<TSTypeValidator extends ExtractChatArgs<TMessages, TSTypeValidator>>(): ChatBuilder<TMessages, TSTypeValidator>
```

#### user

Adds a user message to the ChatBuilder.

```typescript
user<TUserText extends string>(
    str: TUserText
): ChatBuilder<[...TMessages, { role: "user"; content: TUserText }], F.Narrow<TExpectedInput> & ExtractArgs<TUserText>>
```

#### system

Adds a system message to the ChatBuilder.

```typescript
system<TSystemText extends string>(
    str: TSystemText
): ChatBuilder<[...TMessages, { role: "system"; content: TSystemText }], F.Narrow<TExpectedInput> & ExtractArgs<TSystemText>>
```

#### assistant

Adds an assistant message to the ChatBuilder.

```typescript
assistant<TAssistantText extends string>(
    str: TAssistantText
): ChatBuilder<[...TMessages, { role: "assistant"; content: TAssistantText }], F.Narrow<TExpectedInput> & ExtractArgs<TAssistantText>>
```

#### addZodInputValidation

Adds Zod input validation to the ChatBuilder.

```typescript
addZodInputValidation<TZodSchema extends ZodType<TExpectedInput>>(
    schema: TZodSchema
): ChatBuilder<TMessages, z.infer<TZodSchema>>
```

#### validate

Checks if the given args match the expected input format. This method can only be used on a `ChatBuilder` with Zod input validation.

```typescript
validate(args: Record<string, any>): args is TExpectedInput
```

#### build

Builds the chat with the provided arguments, returning the chat array.

```typescript
build<TSuppliedInputArgs extends TExpectedInput>(
    args: F.Narrow<TSuppliedInputArgs>
): Chat<TMessages, TSuppliedInputArgs>
```

### Usage

Please refer to the `ChatBuilder.test.ts` file for examples on how to use `ChatBuilder`. It provides several test cases demonstrating different usages including using the `user`, `assistant`, and `system` methods to add messages, `addInputValidation` to add input validation, `addZodInputValidation` to add Zod validation, and `build` to build the chat array.

**Note:** The `ChatBuilder` class is very flexible due to the usage of generics, but it requires a strong understanding of TypeScript's advanced types, especially around the use of conditional and mapped types.d
