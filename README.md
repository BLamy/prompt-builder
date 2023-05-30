# [Prompt Builder](https://blamy.gitbook.io/prompt-builder)

Prompt Builder is a TypeScript library that allows you to build and validate template prompts. You can create dynamic templates with embedded variables and add type checks on these variables.

This library leverages TypeScript's string literal types to perform compile-time validation. It also integrates with the Zod library, providing runtime validation.

## Installation

```bash
pnpm add prompt-builder
```

Or using yarn:

```bash
yarn add prompt-builder
```

Or using npm:

```bash
npm install --save prompt-builder
```

## Usage

Here's a basic usage of the library:

```ts
import { PromptBuilder } from 'prompt-builder';

const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke");

const prompt = promptBuilder.build({
  jokeType: "funny",
} as const);

console.log(prompt);  // "Tell me a funny joke"
```

## [Documentation](https://blamy.gitbook.io/prompt-builder)

The library is primarily comprised of two main classes, `Prompt` and `PromptBuilder`.

https://blamy.gitbook.io/prompt-builder

## Running Tests

We have included a suite of tests for validating the functionality of the library. You can run these tests using the following command:

```bash
npm run test
```

## Contributions

We welcome contributions to the library. Please raise an issue or create a pull request on the project's GitHub page.

## License

This project is licensed under the MIT License. Please see the LICENSE file for more details.
