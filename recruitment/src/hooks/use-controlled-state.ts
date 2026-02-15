import * as React from 'react';

export interface UseControlledStateProps<T> {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T, ...args: any[]) => void;
}

export function useControlledState<T>({
    value,
    defaultValue,
    onChange,
}: UseControlledStateProps<T>) {
    const [state, setInternalState] = React.useState<T | undefined>(
        value !== undefined ? value : defaultValue
    );

    React.useEffect(() => {
        if (value !== undefined) {
            setInternalState(value);
        }
    }, [value]);

    const setState = React.useCallback(
        (next: T, ...args: any[]) => {
            setInternalState(next);
            onChange?.(next, ...args);
        },
        [onChange]
    );

    return [state, setState] as const;
}
