# vitest-launchdarkly-mock

[![npm version](https://img.shields.io/npm/v/vitest-launchdarkly-mock.svg)](https://www.npmjs.com/package/vitest-launchdarkly-mock)
[![npm downloads](https://img.shields.io/npm/dm/vitest-launchdarkly-mock.svg)](https://www.npmjs.com/package/vitest-launchdarkly-mock)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com/)

[![Star on GitHub](https://img.shields.io/github/stars/bohdanbirdie/vitest-launchdarkly-mock?style=social)](https://github.com/bohdanbirdie/vitest-launchdarkly-mock)


> **Easily unit test LaunchDarkly feature flagged components with Vitest** :clap:

This package is a rip-off from [jest-launchdarkly-mock](https://github.com/launchdarkly/jest-launchdarkly-mock), just adapted for Vitest. 

This package is only compatible with React SDK.

## Installation

```bash
yarn add -D vitest-launchdarkly-mock
```

or

```bash
npm install vitest-launchdarkly-mock --save-dev
```

Then in `vite.config.js` add `vitest-launchdarkly-mock` to setupFiles:

```js
// vite.config.ts

export default defineConfig(() => {
    return {
        test: {
            setupFiles: ['./node_modules/vitest-launchdarkly-mock/dist/index.js'],
        }
    }
});
```

## Usage
Use the only 3 apis for test cases:

* `mockFlags(flags: LDFlagSet)`: mock flags at the start of each test case. Only mocks
flags returned by the `useFlags` hook.

* `ldClientMock`: a Vitest mock of the [ldClient](https://launchdarkly.github.io/js-client-sdk/interfaces/_launchdarkly_js_client_sdk_.ldclient.html). All
methods of this object are Vitest mocks.

* `resetLDMocks` : resets both mockFlags and ldClientMock.

## Example
```tsx
import { mockFlags, ldClientMock, resetLDMocks } from 'vitest-launchdarkly-mock'

describe('button', () => {
  beforeEach(() => {
    // reset before each test case
    resetLDMocks()
  })

  test('flag on', () => {
      // arrange
      // You can use the original unchanged case, kebab-case, camelCase or snake_case keys.
      mockFlags({ devTestFlag: true })

      // act
      const { getByTestId } = render(<Button />)

      // assert
      expect(getByTestId('test-button')).toBeTruthy()
    })

  test('identify', () => {
    // arrange
    mockFlags({ 'dev-test-flag': true })

    // act
    const { getByTestId } = render(<Button />)
    fireEvent.click(getByTestId('test-button'))

    // assert: identify gets called
    expect(ldClientMock.identify).toBeCalledWith({ key: 'aa0ceb' })
  })
})

```