---
description: API Docs for Prompt class
---

# Prompt

The `Prompt` class is responsible for grouping a template string with its arguments. Calling `.toString` on a prompt will return the formatted string typed as a string literal.&#x20;

{% tabs %}
{% tab title="Screenshot" %}
<figure><img src=".gitbook/assets/image (2) (1).png" alt=""><figcaption><p><a href="https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBShc8C+cBmaRwDkY+YMAtAEYCuwANgCYCmUhA3AFBcDGEAdgGd4JdGTgBeOHyYB3FKRgAKAEQAVJnTpwQTOAENECAFYQA1k1UBPME0zYT55QBpEHOO48B6T3AB6Afjc4BwtrJgAuOGUcaj4+S2cOTABKADoYCABlGChgPgBzRWTODl5BCDomVLoIQpEMYrggA">TS Playground</a></p></figcaption></figure>
{% endtab %}

{% tab title="Demo" %}
{% embed url="https://stackblitz.com/edit/node-2t8kve?file=index.ts&terminal=start&embed=1&view=editor&hideExplorer=1&ctl=0" %}
{% endtab %}

{% tab title="Code" %}
{% code lineNumbers="true" fullWidth="true" %}
```typescript
import { Prompt } from 'prompt-builder';

const prompt = new Prompt("Tell me a {{jokeType}} joke", {
      // ^? const prompt: "Tell me a funny joke"
  jokeType: "funny",
}).toString();

console.log(prompt);   // "Tell me a funny joke"
```
{% endcode %}
{% endtab %}
{% endtabs %}

##
