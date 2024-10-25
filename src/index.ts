import { useCallback, useRef, useState } from 'react'

type StartViewTransitionProps<T> = {
    skipTransition?: boolean | ((v: T) => boolean)
}

export const startViewTransition = async (fn: () => void) => {
    if (typeof window === 'undefined' || !('startViewTransition' in document)) {
        fn()
    } else {
        return document.startViewTransition(fn).ready
    }
}

export const useStartViewTransitionWrap = <T>(
    [value, _setState]: [v: T, (v: T | ((prev: T) => T)) => void],
    options: StartViewTransitionProps<T> = {}
): [v: T, (v: T | ((prev: T) => T)) => void] => {
    const optionsRef = useRef(options)
    optionsRef.current = options

    const setState = useCallback(
        async (v: T | ((prev: T) => T)) => {
            const { skipTransition } = optionsRef.current
            const skipFn = typeof skipTransition === 'function' ? skipTransition : (v: T) => skipTransition

            if (!skipFn(value)) {
                return startViewTransition(() => _setState(v))
            }

            _setState(v)
        },
        [_setState, value]
    )

    return [value, setState]
}

export const useStartViewTransitionValue = <T>(_value: T, options: StartViewTransitionProps<T> = {}) => {
    const valueRef = useRef<T>(_value)
    const [value, setValue] = useStartViewTransitionWrap<T>(useState<T>(_value), options)
    const { skipTransition } = options
    const skipFn = typeof skipTransition === 'function' ? skipTransition : (v: T) => skipTransition
    const shouldSkip = skipFn(_value)

    if (_value !== valueRef.current) {
        valueRef.current = _value
        setValue(_value)
    }

    return shouldSkip ? _value : value
}

export const useStartViewTransitionState = <T>(state: T, options: StartViewTransitionProps<T> = {}) => {
    return useStartViewTransitionWrap<T>(useState<T>(state), options)
}
