---
description: TODO WIP
---

# ChatBuilder

### `ChatBuilder` Class

This is the main class of the `prompt-builder` library. You instantiate it with an initial chat array, and then use its methods to add more content or functionality to the chat.

```ts
import { ChatBuilder } from "prompt-builder";

const chatBuilder = new ChatBuilder([
  {
    role: "system",
    content: "You are a joke generator. You only tell {{jokeType}} jokes.",
  },
  {
    role: "user",
    content: "Tell {{me}} {{num}} Jokes.",
  },
  {
    role: "assistant",
    content: "Sure! Let me think...",
  },
]);
```

Here we've initialized a chatBuilder with an array of prompts. Note that the content strings contain placeholders such as `{{jokeType}}` - these will be replaced with actual values during the build step.

### `user`, `system`, `assistant` Methods

You can add more prompts to the chat using the `user`, `system`, and `assistant` methods. They take a string as an argument, which can contain variables in the form `{{variableName}}`. The resulting strings will not contain the leading whitespace.

Here's an example of how to use these methods:

```ts
import { ChatBuilder } from "prompt-builder";

const chatBuilder = new ChatBuilder([])
  .user(`
    Tell me a {{jokeType}} joke.
    Make it a good one!
  `)
  .assistant(`
    {{jokeType}} joke?
    I'll do my best!
  `)
  .system(`
    Processing {{jokeType}} joke.
    Please stand by.
  `);
```

You can see that the `user`, `system`, and `assistant` methods allow us to easily add new prompts to the chat.

### `addZodInputValidation` Method

This method is used to validate the arguments that will be used to replace the placeholders in the prompts. It takes a Zod schema as an argument. If the schema is not fulfilled, the `validate` method will return false.

```ts
import { ChatBuilder } from "prompt-builder";
import { z } from "zod";

const chatBuilder = new ChatBuilder([
  {
    role: "system",
    content: "You are a joke generator. You only tell {{jokeType}} jokes.",
  },
  {
    role: "user",
    content: "Tell {{me}} {{num}} Jokes.",
  },
  {
    role: "assistant",
    content: "Probably a bad joke about atoms",
  },
]).addZodInputValidation(
  z.object({
    jokeType: z.union([z.literal("funny"), z.literal("silly")]),
    me: z.union([z.literal("Brett"), z.literal("Liana")]),
    num: z.number(),
  })
);
```

Here, we've added validation for our prompts. The `jokeType` can only be "funny" or "silly", the `me` variable can only be "Brett" or "Liana", and `num` must be a number.

### `validate` Method

You can validate the arguments against the defined Zod schema by using the `validate` method. It takes the arguments object as a parameter and returns `true` if the validation is successful or `false` otherwise.

```ts
const args = {
  jokeType: "funny",
  num: 1,
  me: "Brett",
};

if (chatBuilder.validate(args)) {
  console.log("The arguments are valid!");


} else {
  console.log("Invalid arguments.");
}
```

Here, we're validating the `args` object against our Zod schema. If the schema is fulfilled, we print "The arguments are valid!", otherwise we print "Invalid arguments."

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
