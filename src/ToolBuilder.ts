interface Tool<I = unknown, O = unknown> {
    name: string;
    type: "query" | "mutation"
    build: (input: I) => O;
}

export class ToolBuilder<TType extends "query" | "mutation" = "query", I = unknown, O = unknown> {
    private name: string;
    private implementation?: (input: I) => O;
    private type: TType;
  
    constructor(name: string, type: TType = "query" as TType) {
      this.name = name;
      this.type = type;
    }
  
    addInputValidation<T = I>(): ToolBuilder<TType, T, O> {
      // Implementation here
      return this as unknown as ToolBuilder<TType, T, O>;
    }
  
    addOutputValidation<T = O>(): ToolBuilder<TType, I, T> {
      // Implementation here
      return this as unknown as ToolBuilder<TType, I, T>;
    }
  
    query(queryFunction: (input: I) => O): ToolBuilder<"query", I, O> {

      return {
        ...this,
        implementation: queryFunction,
        type: "query"
        };    
    }
  
    mutation(mutationFunction: (input: I) => O): ToolBuilder<"mutation", I, O> {
      return {
        ...this,
        implementation: mutationFunction,
        type: "mutation"
        };
    }
  
    build(): Tool<I, O> {
      return {
        name: this.name,
        build: this.implementation!,
        type: this.type
      };
    }
  }