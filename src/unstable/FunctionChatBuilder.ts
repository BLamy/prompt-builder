import { z } from "zod";

class FunctionChatBuilder {
    

    build() {
        return {
            countCharacters: z
                .function()
                .args(z.string())
                .returns(z.number())
                .implement((x) => {
                    return x.trim().length;
                }),
        } as const;
    }
};



new FunctionChatBuilder().build().countCharacters("sanasdfch"); // ?