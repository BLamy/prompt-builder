# Prompt Builder

Prompt Builder is a TypeScript library that allows you to build and validate template prompts. You can create dynamic templates with embedded variables and add type checks on these variables.

This library leverages TypeScript's string literal types to perform compile-time validation. It also integrates with the Zod library, providing runtime validation.

## Installation

```bash
npm install --save promptbuilder
```

Or using yarn:

```bash
yarn add promptbuilder
```

## Usage

Here's a basic usage of the library:

```ts
import { PromptBuilder } from 'promptbuilder';

const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");

const prompt = promptBuilder.build({
  jokeType: "funny",
});

console.log(prompt);  // "Tell me a funny joke"
```

## Documentation

The library is primarily comprised of two main classes, `Prompt` and `PromptBuilder`.

### `Prompt`

The `Prompt` class is responsible for replacing template placeholders with supplied arguments.

```ts
import { Prompt } from 'promptbuilder';

const prompt = new Prompt("Tell me a {{jokeType}} joke", {
  jokeType: "funny",
});

console.log(prompt.toString());  // "Tell me a funny joke"
```

### `PromptBuilder`

The `PromptBuilder` class allows you to define your template and then `build()` your prompt using the supplied data. Note that the result of the `build()` function is still a string literal, meaning you can later write a function that expects certain string literals, making it easy to split out which prompts can go to what providers at a type level.

## Input Validation

The Prompt Builder also supports input validation using basic TypeScript types and Zod schemas.

### TypeScript Validation

```ts
import { PromptBuilder } from 'prompt-builder';

const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");

// Define allowed types for inputs
const validatedPromptBuilder = promptBuilder.addInputValidation<{
  jokeType: "funny" | "silly";
}>();

const prompt = validatedPromptBuilder.build({
  jokeType: "funny",
});

console.log(prompt); // "Tell me a funny joke"

// The following would cause a TypeScript error
validatedPromptBuilder.build({
  jokeType: "bad", // TypeScript error here!
});
```

In the above example, we're defining the `jokeType` argument to be either "funny" or "silly". Any other value will result in a TypeScript error.

### Zod Validation

```ts
import { z } from 'zod';
import { PromptBuilder } from 'prompt-builder';

const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");

// Define a Zod schema for inputs
const validatedPromptBuilder = promptBuilder.addZodInputValidation(z.object({
  jokeType: z.union([z.literal("funny"), z.literal("silly")]),
}));

const prompt = validatedPromptBuilder.build({
  jokeType: "funny",
});

console.log(prompt); // "Tell me a funny joke"

// The following would cause a Zod validation error
validatedPromptBuilder.build({
  jokeType: "bad", // Zod validation error here!
});
```

In the above example, we're defining a Zod schema for our input. This gives us more flexibility and power in terms of validation rules and error handling. 

## Running Tests

We have included a suite of tests for validating the functionality of the library. You can run these tests using the following command:

```bash
npm run test
```

## Contributions

We welcome contributions to the library. Please raise an issue or create a pull request on the project's GitHub page.

## License

This project is licensed under the MIT License. Please see the LICENSE file for more details.