import {
  describe,
  displayResults,
  it,
  expect,
  runTests,
  type DescribeBlock,
} from '@op-engineering/op-test';
import { useEffect, useState } from 'react';

describe('Example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});

export default function App() {
  const [result, setResult] = useState<DescribeBlock | null>(null);

  useEffect(() => {
    runTests().then((results) => {
      setResult(results);
    });
  }, []);

  return displayResults(result);
}
