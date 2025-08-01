export type ClassConstructor<T = any> = new (...args: any[]) => T;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ParamType = 'body' | 'query' | 'param' | 'header' | 'cookie' | 'file' | 'files';

export interface ArgumentMetadata {
  readonly index: number;         // позиція аргументу у методі
  readonly type: ParamType;            // де “живе” значення
  readonly metatype?: Type            // його TS-тип (якщо є)
  readonly data?: string;             // @Body('userId') → 'userId'
  readonly name?: string;             // ім'я функції-методу, якщо декоратор використовується на методі
}


export type ClassType<T = unknown> = {
  new (...args: any[]): T;
};
//
// export const isObjectType = (value: unknown): value is Record<string, unknown> => {
//   return typeof value === 'object' && value !== null && !Array.isArray(value);
// };
//
// export const isClassType = <T>(value: unknown): value is ClassType<T> => {
//   return (
//     typeof value === 'function' &&
//     /^class\s/.test(Function.prototype.toString.call(value))
//   );
// };
