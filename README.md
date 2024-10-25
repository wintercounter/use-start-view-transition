# use-start-view-transition

A set of hooks and utils to use `document.startViewTransition` upon state/value changes.

## Demo & Playground

https://codesandbox.io/p/sandbox/hsrt6g

## Installation

```shell
npm i use-start-view-transition
```

## Usage

### `startViewTransition`

A simply utility function that wraps the `document.startViewTransition` method. It supports server-side rendering and
also gracefully falls back the method is not available in your browser.

```tsx
import { startViewTransition } from 'use-start-view-transition'

startViewTransition(() => {
    // Your code here
})
```

### `useStartViewTransitionState`

Straight up replacement for `useState` that starts a view transition upon state changes.

```tsx
import { useStartViewTransitionState } from 'use-start-view-transition'

const [state, setState] = useStartViewTransitionState(0)
```

### `useStartViewTransitionWrap`

A hook that can be used to wrap any tuples with the following shape: `[state, setState]`. It gives support to any state
management library/util that uses the same shape.

```tsx
import { useStartViewTransitionWrap } from 'use-start-view-transition'
import { useLocalStorage } from 'react-use'

const keyState = useLocalStorage('key', 0)
const [key, setKey] = useStartViewTransitionWrap(keyState)

// Or simply

const [key, setKey] = useStartViewTransitionWrap(useLocalStorage('key', 0))
```

### `useStartViewTransitionValue`

A hook that lets you start a view transition upon a value has been changed. It's useful when you don't have access to
the underlying state setter.

```tsx
import { useStartViewTransitionValue } from 'use-start-view-transition'
import { useQuery } from 'react-query'

const { isLoading: _isLoading } = useQuery({})
const isLoading = useStartViewTransitionValue(_isLoading)
```

## Options

All hooks accept an optional second argument that is an object with the following shape:

```tsx
{
    skipTransition: boolean | (value => boolean)
}
```

### `skipTransition`

A boolean or a function that returns a boolean. If `true`, the view transition will be skipped. If a function is
provided, it will be called with the new value and should return a boolean. This is useful to handle cases where you
don't want to start a view transition. For example, you only want a transition when the value is greater than 10.

```tsx
const [state, setState] = useStartViewTransitionState(0, {
    skipTransition: value => value < 10
})
```

## Asynchronous State Changes

There are cases when you'd like wait for the view transition to be done before doing something else. All hooks and utils
are returning a promise that resolves when the view transition is done.

```tsx
import { startViewTransition, useStarViewTransitionState } from 'use-start-view-transition'

const [state, setState] = useStartViewTransitionState(0)

const handleClick = async () => {
    await startViewTransition(() => {
        // Do something
    })

    // Do something else
}

const handleSelect = async value => {
    await setState(value)

    // Do something else
}
```

## Controlling transition styles

https://developer.chrome.com/docs/web-platform/view-transitions/same-document

## License

MIT
