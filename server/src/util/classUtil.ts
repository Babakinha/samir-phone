export function createClass<T>(c: {new(...args: any): T; }, ...args: any[]): T {
    return new c(...args);
}