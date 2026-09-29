import { test, expect } from "vitest";
import * as core from "../../src/core/index";

test("renameKey", () => {
  const hash = {
    "before":"foo"
  }
  expect(core.renameKey(hash, "before", "after")).toEqual({
    "after":"foo"
  });
})

test("renameKey with the same key", () => {
  const hash = {
    "same":"foo"
  }
  expect(core.renameKey(hash, "same", "same")).toBe(hash);
})
