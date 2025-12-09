export interface Ref<T> {
    value: T;
}

export function ref<T>(initialValue: T): Ref<T> {
    return { value: initialValue };
}
