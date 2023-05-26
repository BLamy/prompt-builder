# PromptBuilder

#### `PromptBuilder`

The `PromptBuilder` class allows you to define your template and then `build()` your prompt using the supplied data. Note that the result of the `build()` function is still a string literal, meaning you can later write a function that expects certain string literals, making it easy to split out which prompts can go to what providers at a type level.

### Input Validation

The Prompt Builder also supports input validation using basic TypeScript types and Zod schemas.

#### TypeScript Validation

{% tabs %}
{% tab title="Demo" %}
<figure><img src=".gitbook/assets/image (1).png" alt=""><figcaption><p><a href="https://tsplay.dev/mZvRKm">TS Playground Example</a></p></figcaption></figure>
{% endtab %}

{% tab title="Code" %}
{% code lineNumbers="true" %}
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
{% endcode %}
{% endtab %}
{% endtabs %}

In the above example, we're defining the `jokeType` argument to be either "funny" or "silly". Any other value will result in a TypeScript error.

#### Zod Validation

{% tabs %}
{% tab title="Demo" %}
<figure><img src=".gitbook/assets/image.png" alt=""><figcaption><p><a href="https://tsplay.dev/mZvRKm">TS Playground Example</a></p></figcaption></figure>
{% endtab %}

{% tab title="Code" %}
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
{% endtab %}
{% endtabs %}

In the above example, we're defining a Zod schema for our input. This gives us more flexibility and power in terms of validation rules and error handling.