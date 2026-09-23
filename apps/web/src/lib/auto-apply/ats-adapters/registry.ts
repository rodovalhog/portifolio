import { ATSAdapter } from "../types";
import { FactorialAdapter } from "./factorial-adapter";
import { AshbyAdapter } from "./ashby-adapter";
import { GenericATSAdapter } from "./generic-adapter";

export class ATSAdapterRegistry {
  private adapters: ATSAdapter[];

  constructor() {
    this.adapters = [
      new FactorialAdapter(),
      new AshbyAdapter(),
      new GenericATSAdapter(), // Fallback must always be last
    ];
  }

  public register(adapter: ATSAdapter): void {
    // Insert before the generic fallback
    this.adapters.splice(this.adapters.length - 1, 0, adapter);
  }

  public resolve(url: string, html?: string): ATSAdapter {
    for (const adapter of this.adapters) {
      if (adapter.detect(url, html)) {
        return adapter;
      }
    }
    return this.adapters[this.adapters.length - 1];
  }
}

export const atsRegistry = new ATSAdapterRegistry();
