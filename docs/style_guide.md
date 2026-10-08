# C++ style guide for student modules

These rules apply to `src/`, `starter/src/`, `include/` and `support/`. They exist so a first-time C++ student can read every line aloud.

| Rule | Write | Not |
| --- | --- | --- |
| Plain arrays | `int seat[ROW_SIZE];` | `vector<int> seat;` |
| Plain int in Unit I | `int count` | `size_t count`, `long` |
| One statement per line | two lines | `a = 1; b = 2;` |
| Braces on their own lines | see below | `if (x) {` |
| Spelled-out names | `position`, `smallest` | `p`, `sm` |
| Explicit increment | `i = i + 1` | `i++`, `++i`, `i += 1` |
| Comment every line | `count = count + 1; // one more person` | bare code |
| No printing in modules | return a value | `cout << ...` inside `search.cpp` |
| Sizes from config.h | `ROW_SIZE`, `COLS` | magic numbers `10`, `5` |
| Real sizes | `sizeof(int)` | "int is 2 bytes" |

```cpp
int linearSearch(int list[], int count, int key)     // returns the index of key, or -1
{
    for (int i = 0; i < count; i = i + 1)   // check values one by one
    {
        noteVisit(i);                   // one more value checked
        if (list[i] == key)             // this is the one we want
        {
            noteFound(i);               // record the answer
            return i;                   // report its position
        }
    }
    return -1;                          // key is not in the list
}
```

Allowed: `<cstring>` for `strcpy` in Stage 9, `const char[]` parameters for string inputs, `bool` returns.

The binary search midpoint is `(low + high) / 2` in Unit I. The overflow-safe version is taught later in the course.

Server (`server/`) and web (`web/`) code are teacher-provided and may use normal modern C++ and JavaScript.
