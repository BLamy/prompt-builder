# ChatBuilder

{% tabs %}
{% tab title="First Tab" %}

{% endtab %}

{% tab title="Code" %}


```typescript
import { z } from 'zod';
import { ChatBuilder } from 'prompt-builder';

const validComponentLibrarySchema = z.union([
  z.literal("shadcn/ui"), z.literal('daisyui')
]);
const validLanguages = z.union([
  z.literal("typescript"), z.literal("javascript")
])

const chatInputSchema = z.object({
  componentLibrary: validComponentLibrarySchema,
  language: validLanguages
});

const chatbuilder = new ChatBuilder([])
  .system("You are a react component generator, Please generate components using react, tailwind, framer-motion, {{componentLibrary}} and {{language}}")
  .user("Can you create a user login form")
  .addZodInputValidation(chatInputSchema);


const chat = chatbuilder.build({
  //   ^?
  componentLibrary: 'shadcn/ui',
  language: "typescript"
});

console.log(chat);
```
{% endtab %}
{% endtabs %}
