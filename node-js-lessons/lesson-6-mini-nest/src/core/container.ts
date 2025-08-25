import 'reflect-metadata';
import { getInjectedTokenMap } from './decorators/inject';
import { isClass } from './utils/is-class';
import { ClassType } from './types';
import MetadataKeys from './decorators/keys';

type Token<T = unknown> = (new (...args: unknown[]) => T) | string | symbol;

export class Container {
  #registered = new Map();
  #singletons = new Map();

  resolve<T>(token: Token<T>): T {
    if (this.#singletons.has(token)) {
      return this.#singletons.get(token);
    }

    const cs = this.#registered.get(token);

    if(!cs) {
      throw new Error(`Token is not registered.`);
    }

    if (!isClass<T>(cs)) {
      this.#singletons.set(token, cs);
      return cs;
    }

    const deps: any[] = Reflect.getMetadata("design:paramtypes", token) || [];
    const injectMap = getInjectedTokenMap(token) || new Map();

    const resolvedDeps = deps.map((depType, index) => {
      const actualToken = injectMap.get(index) ?? depType;

      if (!this.#registered.has(actualToken)) {
        throw new Error(`Dependency "${actualToken.name || actualToken.toString()}" for "${cs.name}" is not registered.`);
      }

      if (actualToken === token) {
        throw new Error(`Circular dependency detected for token.`);
      }

      return this.resolve(actualToken);
    });

    const instance = new cs(...resolvedDeps);

    this.#singletons.set(token, instance);
    return instance;
  }

  register<T>(token: Token<T>, member: T): void {
    console.log('token', token, 'member', member)
    if (this.#registered.has(token)) return;

    this.#registered.set(token, member);
  }

  registerModule(moduleClass: ClassType) {
    const meta: any = Reflect.getMetadata(MetadataKeys.MODULE, moduleClass);
    if (!meta) throw new Error(`Module "${moduleClass.name}" has no metadata.`);

    (meta.imports || []).forEach((imp: ClassType) => this.registerModule(imp));

    (meta.providers || []).forEach((provider: ClassType) => this.register(provider, provider));

    (meta.controllers || []).forEach((controller: ClassType) => this.register(controller, controller));
  }
}

export const container = new Container();
