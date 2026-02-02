---
name: cleanup
description: >
  A code cleanup and readability guide. Use this whenever you need to clean up,
  refactor, or improve the readability of code. Covers naming, structure,
  comments, dead code removal, formatting, and consistency — across Python,
  JavaScript/TypeScript, and general-purpose rules.
---

# Code Cleanup Guide

The goal of cleanup is simple: after cleanup, another developer (or you, six
months later) should be able to read the code quickly and understand exactly
what it does, why, and how.

---

## 1. Naming

Good names are the single most impactful readability improvement you can make.

- **Variables and functions** should be named after what they *represent* or
  *do*, not how they are implemented.
  - ❌ `d`, `tmp`, `x2`, `process()`
  - ✅ `days_elapsed`, `cached_response`, `offset_x`, `calculate_total_price()`

- **Booleans** should read naturally in an `if` statement.
  - ❌ `if is_valid == True`
  - ✅ `if is_valid`
  - ❌ `flag`
  - ✅ `has_permission`, `is_loading`, `should_retry`

- **Constants** should be `UPPER_SNAKE_CASE`.
  - ✅ `MAX_RETRIES = 3`, `API_BASE_URL = "..."`

- **Classes** should be `PascalCase` nouns.
  - ✅ `UserProfile`, `PaymentProcessor`

- **Functions/methods** should be `snake_case` (Python) or `camelCase` (JS/TS) verbs or verb phrases.
  - ✅ `fetch_user_data()`, `calculateDiscount()`

- Avoid abbreviations unless they are universally understood (e.g., `id`, `url`, `http`).

---

## 2. Remove Dead Code

Dead code is anything that can never be reached or is no longer used.

- Delete commented-out code blocks. Version control exists for a reason.
- Remove unused imports, variables, and functions.
- Remove unused function parameters (or document why they must remain, e.g.,
  interface compliance).
- Remove `TODO` comments that have been resolved.

Before:
```python
import os
import json       # unused
import requests

# def old_fetch():
#     pass

def fetch_data(url, debug=False):   # debug is never used
    response = requests.get(url)
    return response.json()
```

After:
```python
import os
import requests

def fetch_data(url):
    response = requests.get(url)
    return response.json()
```

---

## 3. Simplify Logic

Simpler logic = fewer bugs and easier reading.

- **Flatten nested conditionals** using early returns or guard clauses.

Before:
```python
def process(user):
    if user:
        if user.is_active:
            if user.has_permission:
                do_something(user)
```

After:
```python
def process(user):
    if not user:
        return
    if not user.is_active:
        return
    if not user.has_permission:
        return
    do_something(user)
```

- **Replace long ternaries** with clear if/else blocks when the expression spans
  more than one line or is hard to parse at a glance.

- **Avoid magic numbers.** Pull them into named constants.
  - ❌ `if retries > 3`
  - ✅ `if retries > MAX_RETRIES`

- **Avoid negated conditions** when possible — they slow readers down.
  - ❌ `if not is_disabled`
  - ✅ `if is_enabled`

---

## 4. Structure and Organization

Code should be organized so that related things live together and the overall
flow is scannable top-to-bottom.

### File-Level

- One clear responsibility per file/module. If a file is doing two unrelated
  things, split it.
- Imports at the top, grouped logically:
  1. Standard library
  2. Third-party packages
  3. Local/project modules
- Constants and configuration near the top, after imports.
- The main entry point or public API at the top of the file; helper/private
  functions below.

### Function-Level

- Keep functions short. A good rule of thumb: if a function doesn't fit on one
  screen (~30–40 lines), it's probably doing too much. Break it apart.
- Each function should do **one thing**. If you find yourself writing "and" in
  the function's purpose, split it.
- Put the happy path first. Handle edge cases and errors after.

### Class-Level (if applicable)

- Order: `__init__` → public methods → private/helper methods.
- Keep classes focused. If a class is growing large and handles multiple
  concerns, consider splitting it.

---

## 5. Comments

Comments should explain *why*, not *what*. The code itself explains what it
does — if it doesn't, rename things instead of adding comments.

- ✅ Good comment:
  ```python
  # Retry with exponential backoff — the upstream API is rate-limited at 100 req/min
  ```

- ❌ Bad comment:
  ```python
  # Increment counter by 1
  count += 1
  ```

- Keep comments up to date. A stale comment is worse than no comment at all.
- For public functions/classes, use docstrings that describe the purpose,
  parameters, and return value.

```python
def calculate_discount(price: float, loyalty_years: int) -> float:
    """
    Calculate the loyalty discount for a customer.

    Args:
        price: The base price of the item.
        loyalty_years: How many years the customer has been a member.

    Returns:
        The discounted price. Minimum discount is 5%, max is 25%.
    """
```

---

## 6. Error Handling

- Don't swallow errors silently. If you catch an exception, at minimum log it.
- Catch specific exceptions, not broad ones like `except Exception`.
- Fail fast: if something is wrong, surface it early rather than letting bad
  state propagate.

Before:
```python
try:
    result = do_something()
except:
    pass
```

After:
```python
try:
    result = do_something()
except ConnectionError as e:
    logger.error("Failed to connect: %s", e)
    raise
```

---

## 7. Formatting and Consistency

Pick a standard and stick to it across the entire codebase.

| Concern              | Python                  | JavaScript / TypeScript     |
|----------------------|-------------------------|-----------------------------|
| Indentation          | 4 spaces                | 2 spaces (Airbnb style)     |
| Max line length      | 88–100 chars            | 100–120 chars               |
| String quotes        | Double quotes preferred | Single quotes (Airbnb)      |
| Semicolons           | N/A                     | Yes (Airbnb)                |
| Trailing commas      | Yes (multi-line)        | Yes (multi-line)            |
| Style guide          | PEP 8                   | Airbnb / StandardJS         |
| Linter               | `ruff` or `flake8`      | `eslint`                    |
| Formatter            | `black`                 | `prettier`                  |

Automate this. Run your formatter and linter before every commit.

---

## 8. Quick Cleanup Checklist

Use this as a pass over any file before you consider it "done":

- [ ] All names are clear and descriptive
- [ ] No commented-out or dead code
- [ ] No unused imports or variables
- [ ] No magic numbers — constants are named
- [ ] Functions are short and do one thing
- [ ] Nested logic is flattened where possible
- [ ] Comments explain *why*, not *what*
- [ ] Public functions have docstrings
- [ ] Errors are caught specifically and handled (not swallowed)
- [ ] Formatting matches the project's style guide
- [ ] Imports are grouped and sorted