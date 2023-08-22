import { strict as assert } from "node:assert";
import { OpenAIFunction } from "../OpenAIFunction";
// import { system, user, assistant } from "../ChatHelpers";
import { Equal, Expect } from "./types.test";
import { z } from 'zod'

describe('OpenAIFunction', () => {
    test('', () => {
        const fn = new OpenAIFunction({
            name: "asdf",
            description: "asdffa",
            parameters: z.object({
                name: z.string()
            }),
            execFn: ({ name }) => {
                return "70 and sunny"
            }
        })

        const foobar = fn.toString()
        const fizzbuzz = fn.run({
            name: 'foo'
        })
    })
})