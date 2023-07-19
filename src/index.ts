import { vi, Mock } from 'vitest';

vi.mock('launchdarkly-react-client-sdk', async () => {
  const { camelCaseKeys } = await vi.importActual<{ camelCaseKeys: () => void }>('launchdarkly-react-client-sdk')
  return {
    asyncWithLDProvider: vi.fn(),
    camelCaseKeys,
    LDProvider: vi.fn(),
    useLDClient: vi.fn(),
    useFlags: vi.fn(() => ({})),
    useLDClientError: vi.fn(),
    withLDConsumer: vi.fn(),
    withLDProvider: vi.fn(),
  }
})

import kebabCase from 'lodash.kebabcase'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import { LDFlagSet } from 'launchdarkly-js-client-sdk'
import {
  asyncWithLDProvider,
  LDProvider,
  useFlags,
  useLDClient,
  withLDConsumer,
  withLDProvider,
} from 'launchdarkly-react-client-sdk'

const mockAsyncWithLDProvider = asyncWithLDProvider as Mock
const mockLDProvider = LDProvider as Mock
const mockUseFlags = useFlags as Mock
const mockUseLDClient = useLDClient as Mock
const mockWithLDConsumer = withLDConsumer as Mock
const mockWithLDProvider = withLDProvider as Mock

export const ldClientMock = {
  track: vi.fn(),
  identify: vi.fn(),
  allFlags: vi.fn(),
  close: vi.fn(),
  flush: vi.fn(),
  getContext: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  setStreaming: vi.fn(),
  variation: vi.fn(),
  variationDetail: vi.fn(),
  waitForInitialization: vi.fn(),
  waitUntilGoalsReady: vi.fn(),
  waitUntilReady: vi.fn(),
}

/* eslint-disable @typescript-eslint/no-explicit-any */
mockAsyncWithLDProvider.mockImplementation(() => Promise.resolve((props: any) => props.children))
mockLDProvider.mockImplementation((props: any) => props.children)
mockUseLDClient.mockImplementation(() => ldClientMock)
mockWithLDConsumer.mockImplementation(() => (children: any) => children)
mockWithLDProvider.mockImplementation(() => (children: any) => children)
/* eslint-enable @typescript-eslint/no-explicit-any */

export const mockFlags = (flags: LDFlagSet) => {
  mockUseFlags.mockImplementation(() => {
    const result: LDFlagSet = {}
    Object.keys(flags).forEach((k) => {
      const kebab = kebabCase(k)
      const camel = camelCase(k)
      const snake = snakeCase(k)
      result[kebab] = flags[k]
      result[camel] = flags[k]
      result[snake] = flags[k]
      result[k] = flags[k]
    })

    return result
  })
}

export const resetLDMocks = () => {
  mockUseFlags.mockImplementation(() => ({}))

  Object.keys(ldClientMock).forEach((k) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jestMockFunction = ldClientMock[k]
    if (typeof jestMockFunction.mock !== 'undefined') {
      jestMockFunction.mockReset()
    }
  })
}
