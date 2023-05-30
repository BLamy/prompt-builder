---
description: Typesafe ChatBuilder
---

# ChatBuilder

### `ChatBuilder` Class

The ChatBuilder class is designed to help in constructing chat conversations with validation. It provides a way to programmatically create chat messages with varying roles (user, system, assistant), input validation, and builds chat arrays.

The ChatBuilder constructor takes an array of ChatCompletionRequestMessage types, and an optional TExpectedInput which represents the expected input format for this chat.

The ChatBuilder provides methods for chaining actions, adding messages with various roles, adding input validation, and building the resulting chat.

## Basic Usage

```ts
import { ChatBuilder } from "prompt-builder";

const chatBuilder = new ChatBuilder([
  {
    role: "system",
    content: "This is an example of a system message",
  },
  {
    role: "user",
    content: "This is an example of a user message",
  },
  {
    role: "assistant",
    content: "This is an example of a assistant message",
  },
]);
```

Here we've initialized a chatBuilder with an array of prompts. Note that the content strings contain placeholders such as `{{uiLibrary}}` - these will be replaced with actual values during the build step.

### `user`, `system`, `assistant` Methods

You can add more prompts to an existing ChatBuilder by chaining the `user`, `system`, and `assistant` methods. They take a string as an argument, which can contain variables in the form `{{variableName}}`. The resulting strings will not contain the leading whitespace.

```typescript
import { ChatBuilder } from "prompt-builder";

const chatBuilder = new ChatBuilder([])
  .system("You are a react component generater. Please create components using only the following dependencies react, tailwind, {{uiLibrary}}, and {{language}}")
  .user(`
    # ComponentName
    {{componentDescription}}
    # ComponentDesc
    {{componentDescription}}
  `)
  .assistant(`
    export const HelloWorld ({ text }) => (
      return <div>{text}</div>
    );
    export default HelloWorld
  `);

```

Or using helper methods:

```ts
import { ChatBuilder, user, assistant, system } from "prompt-builder";

const chatBuilder2 = new ChatBuilder([
  user(`
    Tell me a {{jokeType}} joke.
    Make it a good one!
  `),
  assistant(`
    {{jokeType}} joke?
    I'll do my best!
  `),
  system(`
    Processing {{jokeType}} joke.
    Please stand by.
  `),
]);
```

Prompt-builder also provides helper methods for each of openais message roles (`user`, `system`, and `assistant`).

```ts
import { ChatBuilder, user, assistant, system } from "prompt-builder";

const chatBuilder = new ChatBuilder([
  system("You are a react component generater. Please create components using only the following dependencies react, tailwind, {{uiLibrary}}, and {{language}}"),
  user(`
    # ComponentName
    {{componentDescription}}
    # ComponentDesc
    {{componentDescription}}
  `),
  assistant(`
    export const HelloWorld ({ text }) => (
      return <div>{text}</div>
    );
    export default HelloWorld
  `),
]);
```

note: helper methods also work as tagged template literals however due to restrictions in typescript they will be typed as `string` instead of a string literal // TODO // - update this note to be a real note. // - add link to typescript issue ticket

### `build` Method

Once you've set up your chat and validated your arguments, you can build the chat using the `build` method. It takes an object as an argument, which should contain the values to replace the placeholders in the prompts.

```ts
const args = {
  jokeType: "funny",
  num: 1,
  me: "Brett",
};

const chat = chatBuilder.build(args);
```

Here, we're passing the `args` object to the `build` method. This object will be used to replace the placeholders in our prompts, and the resulting chat will be returned.

These are the basic methods provided by the `prompt-builder` library to create, validate, and build chats.

### `addZodInputValidation` Method

This method is used to validate the arguments that will be used to replace the placeholders in the prompts. It takes a Zod schema as an argument. If the schema is not fulfilled, the `validate` method will return false.

```ts
import { ChatBuilder, system, user } from "prompt-builder";
import { z } from "zod";

const chatBuilder = new ChatBuilder([
  system("You are a react component generater. Please create components using only the following dependencies react, tailwind, {{uiLibrary}}, and {{language}}"),
  user("{{componentDescription}}"),
]).addZodInputValidation({
  uiLibrary: z.union([z.literal("daisyui"), z.literal("shadcn")]),
  language: z.union([z.literal("javascript"), z.literal("typescript")]),
  componentDescription: z.string(),
});
```

Here, we've added validation for our prompts. The `jokeType` can only be "funny" or "silly", the `me` variable can only be "Brett" or "Liana", and `num` must be a number.

### `validate` Method

You can validate the arguments against the defined Zod schema by using the `validate` method. It takes the arguments object as a parameter and returns `true` if the validation is successful or `false` otherwise.

```ts
import { ChatBuilder } from 'prompt-builder';

const chatBuilder = ChatBuilder([
  user("Tell me a {{jokeType}} joke.")
]);

const args = { jokeType: "funnsy" };

if (chatBuilder.validate(args)) {
  console.log("The arguments are valid!", args);
} else {
  console.log("Invalid arguments.", args);
}
```

Here, we're validating the `args` object against our Zod schema. If the schema is fulfilled, we print "The arguments are valid!", otherwise we print "Invalid arguments."

### `.type` Method

Both PromptBuilder and ChatBuilder provide a .type method that can be used to get the broad type of a prompt before it is built that way you can write a function that accepts all possible outputs from a prompt builder
