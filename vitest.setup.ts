import "@testing-library/jest-dom/vitest";

// jsdom does not implement the object-URL API used by the download helper.
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = () => "blob:mermaid-studio-test";
  URL.revokeObjectURL = () => {};
}

// Prevent jsdom from attempting a real navigation when the download anchor is
// clicked in tests; the download itself is asserted through its return value.
HTMLAnchorElement.prototype.click = function click() {};
