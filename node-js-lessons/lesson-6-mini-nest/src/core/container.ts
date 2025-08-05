import 'reflect-metadata';
// import {isController} from "./decorators";
import { getInjectedTokenMap } from './decorators/inject';

export class Container {
  #registered = new Map();
  #singletons = new Map();

  resolve<T>(token: new (...args: any[]) => T): T {
    if (this.#singletons.has(token)) {
      return this.#singletons.get(token);
    }

    const cs = this.#registered.get(token);
    if(!cs) {
      throw new Error(`Token ${token.name} is not registered.`);
    }

    const deps: any[] = Reflect.getMetadata("design:paramtypes", token) || [];
    const injectMap = getInjectedTokenMap(token) || new Map();

    const resolvedDeps = deps.map((depType, index) => {
      const actualToken = injectMap.get(index) ?? depType;

      if (actualToken === token) {
        throw new Error(`Circular dependency detected for token ${token.name}.`);
      }

      return this.resolve(actualToken);
    });

    const instance = new cs(...resolvedDeps);

    this.#singletons.set(token, instance);
    return instance;
  }

  register<T extends Function>(token: T, member: T): void {
    console.log('token', token, 'member', member)
    if (this.#registered.has(token)) {
      throw new Error(`Token ${token.name} is already registered.`);
    }

    this.#registered.set(token, member);
  }
}

export const container = new Container();
