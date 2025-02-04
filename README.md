# op-test

A lightweight, in-app testing framework for React Native applications.

![Screenshot of test results](./screenshot.png)

## Installation

```sh
npm install --save @op-engineering/op-test
```

## Usage

Import the testing utilities and write your tests:

```tsx
import { describe, it, expect } from '@op-engineering/op-test';

describe('Example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
```

You can then call the `runTests` function which will run all the functions registered under the `describe` blocks:

```ts
import {runTests} from '@op-engineering/op-test`;

const results = await runTests()
```

### Available Functions

- `describe(name: string, fn: () => void)`: Group related tests
- `it(name: string, fn: TestFunction)`: Define a test case
- `expect(value)`: Create assertions with:
  - `.toBe(expected)`: Strict equality
  - `.toEqual(expected)`: Loose equality
  - `.not.toBe(expected)`: Negative strict equality
  - `.not.toEqual(expected)`: Negative loose equality
  - `.resolves`: For testing promises
  - `.rejects`: For testing promise rejections

### Hooks

- `beforeAll(fn)`: Run before all tests in a describe block
- `beforeEach(fn)`: Run before each test
- `afterAll(fn)`: Run after all tests in a describe block
- `afterEach(fn)`: Run after each test

### Display Results

Use the `displayResults` component to show test results in your app in a visual way:

```tsx
import { runTests, displayResults } from '@op-engineering/op-test';

export default function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    runTests().then(setResult);
  }, []);

  return displayResults(result);
}
```

### CI

You probably want to automate your in-app tests in your CI. For this you can pass the DescribeBlock to the `allTestsPassed` function, it will return a boolean that indicates if all tests have passed. You can this automate this in various ways in your CI. My favorite is starting and in-app http server, exposing a single endpoint. From your CI you can then start the app, query this endpoint (over and over until it returns a reponse). Here is a snippet how to do this.

Server code:

```ts
import { BridgeServer } from 'react-native-http-bridge-refurbished';

let testsPassed: boolean | null = null;

const server = new BridgeServer('http_service', true);

server.get('/ping', async (_req, _res) => {
  return { message: 'pong' };
});

server.get('/results', async (_req, _res) => {
  return { testPassed };
});

server.listen(9000);

export function startServer() {
  return server;
}

export function stopServer() {
  server.stop();
}

export function setServerTestPassed(r: boolean) {
  testsPassed = r;
}
```

Then to run your tests:

```tsx
import {
  runTests,
  displayResults,
  allTestsPassed,
} from '@op-engineering/op-test';
import { startServer, setServerTestPassed } from './server';

export default function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    runTests().then((newResults) => {
      setServerTestPassed(allTestsPassed(newResults));
      setResult(newResults);
    });

    startServer();
  }, []);

  return displayResults(result);
}
```

The CI code is left as an exercise to the reader, just curl the device ip until you get a response.

## License

MIT
