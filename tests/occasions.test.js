import { describe, test, expect, vi, afterEach } from "vitest";
import occasions, { getOccasion } from "../src/index";
import browser from "../src/browser";
import presets from "../src/presets";
import occasionsData from "../src/occasions.json";

const fakeElement = () => ({ classList: { add: vi.fn() }, dataset: {} });

test("getOccasion", () => {
  expect(getOccasion({ occasions: presets, date: "May 04" })).toEqual("star-wars");
  expect(getOccasion({ occasions: presets, date: "Sep 25" })).toEqual("dolly-day");
  expect(getOccasion({ date: "Feb 27", occasions: { "Feb 27": "birthday" } })).toEqual("birthday");
  expect(getOccasion({ occasions: presets, date: "Feb 29" })).toBeUndefined();
})

test("custom occasions don't leak between calls", () => {
  getOccasion({ date: "Feb 27", occasions: { "Feb 27": "birthday" } });
  expect(getOccasion({ occasions: presets, date: "Feb 27" })).toBeUndefined();
})

test("occasions tags the target and calls onOccasion", () => {
  const target = fakeElement();
  const onOccasion = vi.fn();
  expect(occasions({ occasions: presets, date: "Apr 01", target, onOccasion })).toEqual("april-fools");
  expect(target.classList.add).toHaveBeenCalledWith("occasion-april-fools");
  expect(target.dataset.occasion).toEqual("april-fools");
  expect(onOccasion).toHaveBeenCalledWith("april-fools");
})

test("occasions without a DOM or options", () => {
  expect(() => occasions()).not.toThrow();
  expect(occasions({ occasions: presets, date: "Mar 14" })).toEqual("pi");
})

describe("with a DOM", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  })

  test("tags document.body by default", () => {
    const body = fakeElement();
    vi.stubGlobal("document", { body });
    occasions({ occasions: presets, date: "May 04" });
    expect(body.dataset.occasion).toEqual("star-wars");
  })

  test("waits for DOMContentLoaded when there is no body yet", () => {
    let ready;
    const doc = { body: null, readyState: "loading", addEventListener: vi.fn((event, callback) => { ready = callback }) };
    vi.stubGlobal("document", doc);
    const onOccasion = vi.fn();
    expect(occasions({ occasions: presets, date: "May 04", onOccasion })).toEqual("star-wars");
    expect(doc.addEventListener).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function), { once: true });
    expect(onOccasion).not.toHaveBeenCalled();
    doc.body = fakeElement();
    ready();
    expect(doc.body.dataset.occasion).toEqual("star-wars");
    expect(onOccasion).toHaveBeenCalledWith("star-wars");
  })

  test("tags the element with the given ID", () => {
    const body = fakeElement();
    const app = fakeElement();
    const getElementById = vi.fn((id) => id === "app" ? app : null);
    vi.stubGlobal("document", { body, getElementById });
    occasions({ occasions: presets, date: "May 04", element: "app" });
    expect(app.dataset.occasion).toEqual("star-wars");
    expect(body.dataset.occasion).toBeUndefined();
    occasions({ occasions: presets, date: "Mar 14", element: "#app" });
    expect(getElementById).toHaveBeenLastCalledWith("app");
    expect(app.classList.add).toHaveBeenLastCalledWith("occasion-pi");
  })

  test("target takes priority over element", () => {
    const target = fakeElement();
    const getElementById = vi.fn();
    vi.stubGlobal("document", { body: fakeElement(), getElementById });
    occasions({ occasions: presets, date: "May 04", element: "app", target });
    expect(target.dataset.occasion).toEqual("star-wars");
    expect(getElementById).not.toHaveBeenCalled();
  })

  test("waits for DOMContentLoaded when the element isn't parsed yet", () => {
    let ready;
    let app = null;
    const doc = {
      body: fakeElement(),
      readyState: "loading",
      getElementById: () => app,
      addEventListener: vi.fn((event, callback) => { ready = callback })
    };
    vi.stubGlobal("document", doc);
    occasions({ occasions: presets, date: "May 04", element: "app" });
    expect(doc.addEventListener).toHaveBeenCalledWith("DOMContentLoaded", expect.any(Function), { once: true });
    app = fakeElement();
    ready();
    expect(app.dataset.occasion).toEqual("star-wars");
    expect(doc.body.dataset.occasion).toBeUndefined();
  })

  test("warns when no element has the given ID", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const body = fakeElement();
    const onOccasion = vi.fn();
    vi.stubGlobal("document", { body, readyState: "complete", getElementById: () => null });
    expect(occasions({ occasions: presets, date: "May 04", element: "missing", onOccasion })).toEqual("star-wars");
    expect(warn).toHaveBeenCalledWith('[occasions] no element found with id "missing".');
    expect(body.classList.add).not.toHaveBeenCalled();
    expect(onOccasion).toHaveBeenCalledWith("star-wars");
    warn.mockRestore();
  })
})

test("occasions calls onOccasion without a DOM", () => {
  const onOccasion = vi.fn();
  occasions({ occasions: presets, date: "May 04", onOccasion });
  expect(onOccasion).toHaveBeenCalledWith("star-wars");
})

test("occasions with no occasion today", () => {
  const target = fakeElement();
  const onOccasion = vi.fn();
  expect(occasions({ occasions: presets, date: "Feb 29", target, onOccasion })).toBeUndefined();
  expect(target.classList.add).not.toHaveBeenCalled();
  expect(onOccasion).not.toHaveBeenCalled();
})

test("getOccasion without options", () => {
  expect(getOccasion()).toBeUndefined();
})

test("no occasions provided", () => {
  const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
  expect(occasions({ date: "May 04", target: fakeElement() })).toBeUndefined();
  expect(debug).toHaveBeenCalledWith(expect.stringContaining("occasions/presets"));
  debug.mockRestore();
})

test("presets", () => {
  expect(presets).toEqual(occasionsData);
  expect(presets["May 04"]).toEqual("star-wars");
})

test("class prefix", () => {
  const target = fakeElement();
  occasions({ occasions: presets, date: "May 04", target, prefix: "holiday-" });
  expect(target.classList.add).toHaveBeenLastCalledWith("holiday-star-wars");
  occasions({ occasions: presets, date: "May 04", target, prefix: "" });
  expect(target.classList.add).toHaveBeenLastCalledWith("star-wars");
  expect(target.dataset.occasion).toEqual("star-wars");
})

test("log option", () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const group = vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
  const groupEnd = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  occasions({ date: "Jan 01", log: true, occasions: { ...presets, "Feb 27": "birthday" }, target: fakeElement() });
  expect(group).toHaveBeenCalledWith("[occasions] available occasions...");
  const lines = log.mock.calls.map(([line]) => line);
  expect(lines[0]).toEqual("Jan 01: new-years");
  expect(lines).toContain("Feb 27: birthday");
  expect(groupEnd).toHaveBeenCalled();
  vi.restoreAllMocks();
})

test("script tag build", () => {
  expect(browser).toBe(occasions);
  expect(browser.presets).toBe(presets);
  expect(browser.getOccasion({ occasions: presets, date: "May 04" })).toEqual("star-wars");
})
