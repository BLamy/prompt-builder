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

{% embed url="https://stackblitz.com/github/total-typescript/type-transformations-workshop?ctl=0&embed=1&file=src/01-inference-basics/01-get-function-return-type.problem.ts&hideExplorer=1&terminal=e-01&view=editor" fullWidth="false" %}

{% embed url="https://stackblitz.com/github/total-typescript/type-transformations-workshop?ctl=0&embed=1&file=src/01-inference-basics/01-get-function-return-type.problem.ts&hideExplorer=1&terminal=e-01&view=editor" %}

{% embed url="https://stackblitz.com/edit/nextjs-69yqyn?file=README.md" %}

{% embed url="https://stackblitz.com/edit/typescript-7etk5h?file=examples%2Fe1.ts" %}
[https://stackblitz.com/edit/typescript-7etk5h?file=examples%2Fe1.ts](https://stackblitz.com/edit/typescript-7etk5h?file=examples%2Fe1.ts)\&embed=1\&view=editor\&hideExplorer=1\&ctl=0\&terminal=e-01
{% endembed %}



{% embed url="https://stackblitz.com/edit/vitejs-vite-ew9i9r?file=index.html&terminal=dev" %}
