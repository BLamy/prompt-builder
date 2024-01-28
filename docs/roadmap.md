# Roadmap

setTokenLimit - the ability to set a token limit so that built chats are within an expected token limit.

chatHistory - should be able to be passed into the array to define where chat history will be fed into the prompt







Inspired by [priompt](https://github.com/anysphere/priompt)



Priorities -  where a higher priority means that the child is more important to include in the prompt. If no priority is specified, the child is included if and only if its parent is included. Absolute priorities are specified with `p` and relative ones are specified with `prel`.

1. `<scope>`: this allows you to set priorities `p` for absolute or `prel` for relative.
2. `<first>`: the first child with a sufficiently high priority will be included, and all children below it will not. This is useful for fallbacks for implementing something like "when the result is too long we want to say `(result omitted)`".
3. `<empty>`: for specifying empty space, useful for reserving tokens for generation.
4. `<capture>`: capture the output and parse it right within the prompt.
5. `<isolate>`: isolate a section of the prompt with its own token limit. This is useful for guaranteeing that the start of the prompt will be the same for caching purposes.

Toolbuilder\
