---
description: API Docs for PromptBuilder class
---

# PromptBuilder

`PromptBuilder`

The `PromptBuilder` class allows you to define your template and then `build()` your prompt using the supplied data. Note that the result of the `build()` function is still a string literal, meaning you can later write a function that expects certain string literals, making it easy to split out which prompts can go to what providers at a type level.



### Basic Usage

{% embed url="https://stackblitz.com/edit/node-uhvf9x?ctl=0&file=index.ts&hideExplorer=1&terminal=e1&view=editor&embed=1" fullWidth="true" %}
Note Args passed into `build` must be constant
{% endembed %}

### Input Validation

The Prompt Builder also supports input validation using basic TypeScript types and Zod schemas.

#### TypeScript Validation

{% embed url="https://stackblitz.com/edit/node-w3j5wo?file=index.ts&terminal=start&embed=1&view=editor&hideExplorer=1&ctl=0" fullWidth="true" %}

In the above example, we're defining the `jokeType` argument to be either "funny" or "silly". Any other value will result in a TypeScript error.

#### Zod Validation

{% tabs %}
{% tab title="Screenshot" %}
<figure><img src=".gitbook/assets/image.png" alt=""><figcaption><p><a href="https://tsplay.dev/mZvRKm">TS Playground Example</a></p></figcaption></figure>
{% endtab %}

{% tab title="Demo" %}
{% embed url="https://stackblitz.com/edit/node-w3j5wo?file=index.ts&terminal=start&embed=1&view=editor&hideExplorer=1&ctl=1" %}
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

#### Validate - TS helper

If zod validation is added to a PromptBuilder then you can use the `validate` type predicate to scope down your types in the event a prompt builder requires a type more narrow than is currently defined.&#x20;

{% tabs %}
{% tab title="Example" %}
<figure><img src=".gitbook/assets/validateArgs (1).gif" alt=""><figcaption><p><a href="https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgLzgXzgMyhEcDkyEAJvgNwBQoksicACjuDAEICuwANsQKZTpYmBMEzAwAtACMO3PuQoUAxhAB2AZ3gjcY9l178AvHBU8A7g1GsZ+gBQAiACo9OnOCB5wAhogQArCADWPA4AnmA8aBj+QXYAlAB0nsTEAFokAJIqYGwwAGqenMDEnjDAqjbI8RCSvjyKMDYIFHBw0cFhPABcKPFsKmUqNgDalYUwfAX2mH0qIXEAND1jE5z2alycc7EAurHzFGixsZRKqhpeUADmanBGTS1toeHddtMqs3b7aCfAmHA2WmYulkUHiADcCkUSjwbJ4rmojohmnBlOpNJZbnBATprHx4tI9LD4cdkai1BBODx4pwIJcAZYSWggA">TS Playground Example</a></p></figcaption></figure>
{% endtab %}

{% tab title="Code" %}
{% code lineNumbers="true" %}
```typescript
import { z } from 'zod';
import { PromptBuilder } from 'prompt-builder';

const promptBuilder = new PromptBuilder("Tell me a {{jokeType}} joke").addZodInputValidation(z.object({
  jokeType: z.union([z.literal("funny"), z.literal("silly")]),
}));

const args = {
  jokeType: "funny",
};

if (promptBuilder.validate(args)) {
  const prompt = promptBuilder.build(args);
  console.log(prompt);
}

```
{% endcode %}
{% endtab %}
{% endtabs %}
