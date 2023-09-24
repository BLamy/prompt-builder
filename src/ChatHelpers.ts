// ChatMessage creation helpers
// Ideally these would Dedent their content, but ts is checker is way too slow
// https://tinyurl.com/message-creators-literal-types
export function System<T extends string | null>(
  literals: TemplateStringsArray | T,
  ...placeholders: unknown[]
) {
  return {
    role: "system" as const,
    content: dedent(literals, ...placeholders),
  };
}
export function User<T extends string | null>(
  literals: TemplateStringsArray | T,
  ...placeholders: unknown[]
) {
  return {
    role: "user" as const,
    content: dedent(literals, ...placeholders),
  };
}
export function Assistant<T extends string | null>(
  literals: TemplateStringsArray | T,
  ...placeholders: unknown[]
) {
  return {
    role: "assistant" as const,
    content: dedent(literals, ...placeholders),
  };
}
export function Function<T extends string | null>(
  literals: TemplateStringsArray | T,
  ...placeholders: unknown[]
) {
  return {
    role: "function" as const,
    content: dedent(literals, ...placeholders),
  };
}

// legacy purposes
export const assistant = Assistant;
export const user = User;
export const system = System;

export function dedent<T extends string | null>(
  templ: TemplateStringsArray | T,
  ...values: unknown[]
): typeof templ extends TemplateStringsArray ? string | null : T {
  let strings =
    templ && Array.from(typeof templ === "string" ? [templ] : templ);

  // 1. Remove trailing whitespace.
  strings[strings.length - 1] = strings[strings.length - 1].replace(
    /\r?\n([\t ]*)$/,
    "",
  );

  // 2. Find all line breaks to determine the highest common indentation level.
  const indentLengths = strings.reduce<number[]>((arr, str) => {
    const matches = str.match(/\n([\t ]+|(?!\s).)/g);
    if (matches) {
      return arr.concat(
        matches.map((match) => match.match(/[\t ]/g)?.length ?? 0),
      );
    }
    return arr;
  }, []);

  // 3. Remove the common indentation from all strings.
  if (indentLengths.length) {
    const pattern = new RegExp(`\n[\t ]{${Math.min(...indentLengths)}}`, "g");

    strings = strings.map((str) => str.replace(pattern, "\n"));
  }

  // 4. Remove leading whitespace.
  strings[0] = strings[0].replace(/^\r?\n/, "");

  // 5. Perform interpolation.
  let string = strings[0];

  values.forEach((value, i) => {
    // 5.1 Read current indentation level
    const endentations = string.match(/(?:^|\n)( *)$/);
    const endentation = endentations ? endentations[1] : "";
    let indentedValue = value;
    // 5.2 Add indentation to values with multiline strings
    if (typeof value === "string" && value.includes("\n")) {
      indentedValue = String(value)
        .split("\n")
        .map((str, i) => {
          return i === 0 ? str : `${endentation}${str}`;
        })
        .join("\n");
    }

    string += indentedValue + strings[i + 1];
  });

  return string as any;
}
