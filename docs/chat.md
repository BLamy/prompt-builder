# Chat

The Chat Builder simplifies the creation, validation and manipulation of chat message prompts. It builds on top of PromptBuilder and provides easy message creation, provides auto-dedent functionality, and strict typesafety.

### Basic Usage:

{% tabs %}
{% tab title="Example" %}
<figure><img src=".gitbook/assets/image (1).png" alt=""><figcaption><p><a href="https://www.typescriptlang.org/play?module=1#code/JYWwDg9gTgLgBAbzgYQBYEMYBo4FcDOAplDvgJ74yEg7r77CXoB28AvnAGZQQhwBEYHuBgBaAEa5gAGwAmxfgG4AUMoDGEZpThqM8ALxxmhAO4o9ACmVw4Aels24APQD81uAG13N8pWoWAAwAVQmlpOBBCOHREBAArCABrQiCyMEI2DgTkgIBKLG88IihAhAQoQnxILQyspMIXPILHaPpGGBYYQOyG2I0QSNZMpvcAXWbEQp7U9IAuAU5cZmYyfgmbCqrNInn+AGVcCpxUYiiyCFw4AHMINcL+wZhdoNRGODeY3yo+B8JWO5sbGUuQAdDAIABBKBQdBkCy5FTqbYQaSEEHSCBXCy6TAI5RAA">TS Playground Example</a></p></figcaption></figure>
{% endtab %}

{% tab title="Code" %}
{% code lineNumbers="true" %}
```typescript
import { Chat, user, system, assistant } from "prompt-builder";

const chat = new Chat(
  //   ^?
  [
    system(`Tell me a {{jokeType}} joke`),
    user(`{{response}} joke?`),
    assistant(`joke? {{comment}}`),
  ],
  {
    jokeType: "funny",
    response: "Sure, here you go",
    comment: "This is a system comment",
  }
).toArray();

console.log(chat);
```
{% endcode %}
{% endtab %}
{% endtabs %}
