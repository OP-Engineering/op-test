import {
  describe,
  displayResults,
  it,
  expect,
  runTests,
  type DescribeBlock,
} from '@op-engineering/op-test';
import { useEffect, useState } from 'react';

// --- Tests for the testing framework itself ---

describe('Core Functionality', () => {
  it('should handle a simple passing test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle a simple failing test', () => {
    // This test is expected to fail
    expect(1 + 1).toBe(3);
  });

  it('should handle a passing async test', async () => {
    const value = await Promise.resolve(42);
    expect(value).toBe(42);
  });

  it('should handle a failing async test', async () => {
    // This test is expected to fail
    await Promise.resolve();
    expect(true).toBe(false);
  });
});

describe('Expect Matchers', () => {
  describe('.toBe()', () => {
    it('passes for strict equality', () => expect(5).toBe(5));
    it('fails for strict inequality', () => expect(5).toBe('5'));
  });

  describe('.not.toBe()', () => {
    it('passes for strict inequality', () => expect(5).not.toBe('5'));
    it('fails for strict equality', () => expect(5).not.toBe(5));
  });

  describe('.toEqual()', () => {
    it('passes for loose equality', () => expect(5).toEqual('5'));
    it('fails for loose inequality', () => expect(5).toEqual(6));
  });

  describe('.not.toEqual()', () => {
    it('passes for loose inequality', () => expect(5).not.toEqual(6));
    it('fails for loose equality', () => expect(5).not.toEqual('5'));
  });

  describe('.toExist()', () => {
    it('passes for non-null/undefined values', () => {
      expect(0).toExist();
      expect('').toExist();
      expect({}).toExist();
    });
    it('fails for null', () => expect(null).toExist());
    it('fails for undefined', () => expect(undefined).toExist());
  });

  describe('.toBeTruthy() / .toBeFalsy()', () => {
    it('passes for truthy values', () => expect(1).toBeTruthy());
    it('fails for falsy values with toBeTruthy', () => expect(0).toBeTruthy());
    it('passes for falsy values', () => expect(0).toBeFalsy());
    it('fails for truthy values with toBeFalsy', () => expect(1).toBeFalsy());
  });

  describe('.toContain()', () => {
    it('passes for item in array', () => expect([1, 2, 3]).toContain(2));
    it('fails for item not in array', () => expect([1, 2, 3]).toContain(4));
    it('passes for substring in string', () =>
      expect('hello').toContain('ell'));
    it('fails for substring not in string', () =>
      expect('hello').toContain('x'));
  });

  describe('.toDeepEqual()', () => {
    it('passes for deeply equal objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(obj1).toDeepEqual(obj2);
    });
    it('fails for different objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 3 } };
      expect(obj1).toDeepEqual(obj2);
    });
  });

  describe('Promise Matchers', () => {
    it('.toBePromise() passes for a promise', () => {
      expect(Promise.resolve()).toBePromise();
    });
    it('.toBePromise() fails for a non-promise', () => {
      expect({ then: 'not a function' }).toBePromise();
    });
    it('.not.toBePromise() passes for a non-promise', () => {
      expect({}).not.toBePromise();
    });
    it('.not.toBePromise() fails for a promise', () => {
      expect(Promise.resolve()).not.toBePromise();
    });
  });

  describe('.resolves', () => {
    it('.toBe() passes when promise resolves to the correct value', async () => {
      await expect(Promise.resolve(42)).resolves.toBe(42);
    });
    it('.toBe() fails when promise resolves to a different value', async () => {
      await expect(Promise.resolve(42)).resolves.toBe(43);
    });
    it('.toEqual() passes for loose equality', async () => {
      await expect(Promise.resolve(42)).resolves.toEqual('42');
    });
    it('.toEqual() fails for loose inequality', async () => {
      await expect(Promise.resolve(42)).resolves.toEqual(43);
    });
  });

  describe('.rejects', () => {
    it('.toThrow() passes when a promise rejects with the correct message', async () => {
      await expect(Promise.reject(new Error('oops'))).rejects.toThrow('oops');
    });
    it('.toThrow() fails when a promise rejects with a different message', async () => {
      await expect(Promise.reject(new Error('wrong'))).rejects.toThrow('oops');
    });
    it('.toThrow() fails when a promise resolves instead of rejecting', async () => {
      await expect(Promise.resolve()).rejects.toThrow('oops');
    });
  });
});

// --- App Component to display results ---

export default function App() {
  const [result, setResult] = useState<DescribeBlock | null>(null);

  useEffect(() => {
    runTests().then((results) => {
      setResult(results);
    });
  }, []);

  return displayResults(result);
}
