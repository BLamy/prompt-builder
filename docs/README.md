---
description: Typesafe PromptBuilder
---

# Getting Started

Prompt Builder is a TypeScript library that allows you to build and validate template prompts. You can create dynamic templates with embedded variables and add type checks on these variables.

This library leverages TypeScript's string literal types to perform compile-time validation. It also integrates with the Zod library, providing runtime validation.

## Install from NPM

{% tabs %}
{% tab title="pnpm" %}
```bash
pnpm add prompt-builder
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add prompt-builder
```
{% endtab %}

{% tab title="npm" %}
```bash
npm install prompt-builder --save
```
{% endtab %}
{% endtabs %}

## Features

### Inferred Literals

Using PromptBuilder allows you to maintain a strictly typed literal of your prompts throughout your application instead of downcasting your prompts to `string`

<figure><img src=".gitbook/assets/image (5).png" alt=""><figcaption><p><a href="https://www.typescriptlang.org/play?ts=5.0.4#code/JYWwDg9gTgLgBAbzgBShc8C+cBmaRwDkY+YMAtAEYCuwANgCYCmUhA3AFAcDGEAdgGd4AKwgBrJgBUAnmCZwAvERzU+faYR78hcGE3B0AhnoDKMKMD4BzRXAAGkpnTpwQ8w3AAkCURJlzsXyY7TgB6ULhIyIA9AH4tQXgSdDJbPiYAdxRSGAAKQkdnV3dEH3EpWSZMQPLCABpEDkjwqLimuCD-JjqObEMBOF5EgEoAOhgIMwtrXOHODiA">TS Playground example</a></p></figcaption></figure>

### Typesafe generate functions

If your prompts are strictly typed as literals then you can write a generate function that accepts a string literal. This is useful if you have certain prompts that work best on certain models.

{% embed url="https://stackblitz.com/edit/node-mgkkwe?file=index.ts&terminal=start&embed=1&view=editor&hideExplorer=1&ctl=0" fullWidth="true" %}
[Stackblitz Demo](https://stackblitz.com/edit/node-mgkkwe?file=index.ts\&terminal=start)
{% endembed %}

### Compile time validation with typescript

PromptBuilder & ChatBuilder provide typescript support validating inputs at compile time.

&#x20;

<figure><img src=".gitbook/assets/ChatBuilder.gif" alt=""><figcaption></figcaption></figure>

## Runtime validation with zod

Sometimes variables come from user input and aren't known at compile time. A zod object can be provided as an alternative to providing types using typescript.

{% embed url="https://stackblitz.com/edit/stackblitz-starters-5jzdje?file=src%2FApp.tsx" %}
