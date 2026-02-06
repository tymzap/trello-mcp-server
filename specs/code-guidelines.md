# Code guidelines

This document contains foundational, purpose-agnostic code guidelines designed for reuse across all codebase.

## 1. Meaningful names

1. Use intention-revealing, searchable, and descriptive names that make comments redundant.
2. Avoid abbreviations, misleading terms, or overly generic names (for example, use `fetchUserProfile` over `fetchData`).
3. Maintain naming consistency; do not use multiple terms for the same concept (e.g., do not use "session", "context" and "state" interchangeably, always use "session" instead).
4. Scale descriptiveness based on context. Names should be shorter if the directory or namespace already provides clarity (for example, `getToken()` inside `auth/google` is preferred over `getGoogleAuthToken()`).
5. Use camelCase convention for all variable, function, and property names. Use SCREAMING_SNAKE_CASE convention for constants storing configuration values. 

```ts
// ✅ Correct: descriptive, consistent, context-aware
const maxRetryAttempts = 3;

function fetchUserProfile(userId: string) {}

interface UserIdentity {
  displayName: string;
  avatarUrl?: string;
}

function formatUserHeader(user: UserIdentity) {
  return `${user.displayName} (${user.avatarUrl})`;
}

// ❌ Wrong: abbreviations, vague, misleading, too broad
const maxAttps = 3;

function fetchData(id: string) {}

type Data = {
  d?: string;
  a?: string;
};

function handle(item: Data) {
  return item.d + item.a;
}

// ✅ Correct
// src/auth/google/
function getToken(id: string) {
  // ...
}

// ❌ Wrong: overly specific name. We know enough context from the file location
// src/auth/google/
function getGoogleAuthToken(id: string) {
  // ...
}
```

## 2. One level of abstraction per function

1. Limit each function to a single level of abstraction.
2. Separate high-level orchestration (like rendering complete page) from low-level details (like manipulation of HTML strings). Extract implementation details into smaller, dedicated helper functions.

```ts
// ✅ Correct: one level of abstraction per function
function renderPage(pagePath: string) {
  const html = getHtml(pagePath);
  return wrapInLayout(html);
}

function getHtml(pagePath: string) {
  const parsedPath = parsePath(pagePath);
  return `<html><body>${parsedPath}</body></html>`;
}

function wrapInLayout(content: string) {
  return `<div class="layout">${content}</div>`;
}

// ❌ Wrong: mixing abstraction levels
function renderPage(pagePath: string) {
  const parsedPath = parsePath(pagePath); // intermediate abstraction
  let html = "<html><body>"; // low-level detail
  html += parsedPath; // low-level detail
  html += "</body></html>"; // low-level detail
  return `<div class="layout">${html}</div>`; // high abstraction
}
```

## 3. Exception-based error handling

1. Use exceptions instead of return codes to separate business logic from error handling.
2. Provide context for every error. Include the failed operation and specific details for logging and debugging.
3. Avoid returning `null`. Throw exceptions or return special-case objects (e.g., `[]` or `{ items: [] }`) to eliminate caller-side null checks.
4. Prefix name of the function that may fail with `tryTo`. The public interface handles the try-catch and notifications, while the `tryTo` function contains only the logic. Apply handling selectively at strategic boundaries rather than in every function.
5. Separate user notifications from developer logs. Show simplified, action-oriented messages to users, while logging full error details with context for reporting.

```ts
// ✅ Correct:
// - Public function handles errors at the interaction boundary
// - Internal logic is isolated in a `tryTo` function
// - Logs provide technical context; notifications provide user actions
async function tryToStartCheckout() {
  await authorize();
  await api.post("/checkout");
}

export async function startCheckout() {
  try {
    await tryToStartCheckout();
  } catch (error) {
    console.error(composeErrorMessage(error, "Failed to start checkout"));
    showNotification("We had problems starting checkout. Please try again.");
  }
}

// ❌ Wrong: no error handling at the public boundary
export async function startCheckout() {
  await authorize(); // Throws unhandled exception
  await api.post("/checkout");
}

// ✅ Correct: returning empty array to avoid caller-side null checks
export function getEmployees(): Employee[] {
  return employees ?? [];
}
```

## 4. Minimal and purposeful comments

1. Use comments only as a last resort for special cases (hacks, non-obvious workarounds).
2. Prioritize descriptive naming and function decomposition to make code self-explanatory.
3. If logic can be clarified by renaming a variable or splitting a function, do that instead of adding a comment.

```ts
// ✅ Correct: purposeful, concise comment
// The third-party API returns a 404 error when a record is still being processed instead of a 202.
try {
  return await service.fetchStatus(id);
} catch (error) {
  if (error.statusCode === 404) { 
    return "pending";
  }
  
  throw error;
}

// ❌ Wrong: trivial comment
const config = {
  /* config options here */
};
```

## 5. Early returns

1. Use guard clauses for early returns to handle edge cases and invalid states immediately.
2. Keep the "happy path" at the root level of nesting.
3. Eliminate else blocks when using early return guard clauses to reduce complexity.

```ts
// ✅ Correct: guard clause with happy path at the root level
function getPriceDisplay(price: number | null, currency: string) {
  if (price === null) {
    return "N/A";
  }
  
  if (price === 0) {
    return "Free";
  }

  return `${currency}${price}`;
}

// ❌ Wrong: deep nesting
function getPriceDisplay(price: number | null, currency: string) {
  if (price !== null) {
    if (price !== 0) {
      return `${currency}${price}`;
    } else {
      return "Free";
    }
  } else { 
    return "N/A"; 
  }
}
```

## 6. Magic numbers and strings

1. Replace magic values with named constants to clarify intent and simplify updates.
2. Define constants at the bottom of the file where they are used.
3. If constants grow large or require reuse across multiple files, move constants them a separate file (e.g., `constants.ts`).

```ts
// ✅ Correct: no magic values in logic
const DEFAULT_TIMEOUT_MS = 5000;

if (timeout < DEFAULT_TIMEOUT_MS) {
  // ...
}

// ❌ Wrong: magic values used directly in lo gic
if (timeout < 5000) { // What does 5000 mean?
  // ...
}
```

## 7. File and directory names

1. Use kebab-case convention for all file and directory names (for example, `user-profile.ts`, `auth-provider.ts`).
2. Name files after the main exported symbol. For example, a file exporting `filterUsers` function must be named `filter-users.ts`. If needed, the file can have other additional exported symbols, but the filename must reflect the primary one.

```txt
// ✅ Correct: kebab-case file names
auth-provider.ts
user-profile.ts

// ❌ Wrong: camelCase or PascalCase or snake_case
authProvider.ts
UserProfile.ts
user_profile.ts

// ✅ Correct: file name matches main export
// main export: filterUsers
filter-users.ts

// ❌ Wrong: file name doesn't match main export
// main export: filterUsers
user-filters.ts
myFilterFile.ts
```

## 8. Organizing related code with folders

1. Start with a single file when logic is simple.
2. As logic grows and the file becomes large or cluttered, create a folder with the same name as the original file (minus extension). Move the original file into this folder and extract related logic to additional files in the same folder. Import new files into the original file.
3. Re-export external symbols for this module via an `index.ts` file in the folder (barrel file).
4. Nesting folders is allowed. However, if a folder grows and requires many nested folders, reconsider design for better modularization and conceptual separation.
5. This is one of the *strictly limited* cases where barrel files (`index.ts`) are allowed. If a folder or barrel file becomes too large or mixes concerns, refactor to divide the folder or remove unnecessary barrel exports.

```txt
// Initial state:
user-profile.ts

// After extracting logic:
user-profile/
├── user-profile.ts // original file (main symbol)
├── user-avatar.ts // extracted related part
├── user-roles.ts // extracted related part
└── index.ts // re-exports public API

// Example index.ts:
export * from "./user-profile";
export * from "./user-avatar";
export * from "./user-roles";

// Example import elsewhere:
import { UserProfile, UserAvatar } from "./user-profile";
```

## 9. Import declarations

1. Use named imports for specific symbols instead of importing the entire module.
2. Do not use `import type` syntax.
3. Do not sort imports or divide them by empty lines.
4. Import declarations "code block" should be separated from rest of the code by one empty line.
5. Imports should be at the very top of the file, only for exception of directives like `"use client"`, which comes first.

```ts
// ✅ Correct: importing specific symbols
import { readFile } from "fs/promises";

async function loadConfig() {
  const data = await readFile("config.json");
}

// ❌ Wrong: importing entire module
import * as fs from "fs/promises";

async function loadConfig() {
  const data = await fs.readFile("config.json");
}

// ❌ Wrong: using `import type`
import type { Config } from "./types";
```

## 10. Export declarations  

1. Always use the inline export style by exporting symbols at their declaration (e.g., `export function foo()` or `export const BAR = ...`). Do not use export lists, such as `export { a, b, c }` at the bottom of the file or after declarations.
2. Only export symbols that are actually consumed by other modules. If a symbol is not needed outside the file, keep it private.
3. Barrel files (`index.ts`) are prohibited, except when organizing related code into a folder and providing a single, convenient export. Even in that case, only use a barrel file if it will not cause race conditions or mix unrelated concerns - this should only be done only for simple cases (such as a few closely-related exports).

```ts
// ✅ Correct: export at declaration point
export function validateUser(user: User) { ... }

export const DEFAULT_LIMIT = 50;

// ❌ Wrong: named export list
function validateUser(user: User) { ... }

const DEFAULT_LIMIT = 50;

export { validateUser, DEFAULT_LIMIT };

// ✅ Correct: do not export unless needed externally
function internalHelper() { // not exported
  //...
}

// ✅ Correct: barrel file inside a folder for closely-related symbols
// user-profile/index.ts

export * from "./user-profile";
export * from "./user-avatar";

// ❌ Wrong: barrel file exporting unrelated modules
// utils/index.ts

export * from "./logger";
export * from "./date-utils";
export * from "./user/user-service";
```
