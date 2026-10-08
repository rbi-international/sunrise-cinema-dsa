# Student guide

You are going to rebuild the booking system of Sunrise Cinema in C++. Each part of the system is one Unit I topic. As soon as a function works, the web page animates your own code.

## 1. Set up (do this before class)

You need a C++ compiler (`g++`) and `make`.

| Your computer | Steps |
| --- | --- |
| Windows (recommended) | Install WSL: open PowerShell as administrator, run `wsl --install`, restart. Open "Ubuntu" and run `sudo apt update && sudo apt install -y g++ make git`. |
| Windows (alternative) | Install MSYS2 from msys2.org. Open "MSYS2 UCRT64" and run `pacman -S mingw-w64-ucrt-x86_64-gcc make git`. |
| macOS | Run `xcode-select --install` in Terminal. |
| Linux | `sudo apt install -y g++ make git` |

Then get the project and test it:

```bash
git clone https://github.com/rbi-international/sunrise-cinema-dsa.git
cd sunrise-cinema-dsa
make starter-run
```

Open `http://localhost:8080` in your browser. You should see the cinema page with a yellow "starter code (students)" badge. Press `Ctrl+C` in the terminal to stop the server.

## 2. How the class works

You only edit files in `starter/src/`. Every function there is a list of numbered TODO steps:

```cpp
bool bookSeat(int seat[], int size, int index)  // books one seat
{
    // TODO 2: if index is outside 0 .. size - 1, return false
    // TODO 3: call noteVisit(index) to record one direct look at the seat
    ...
    return false;                       // remove this line when you are done
}
```

For each stage:

1. Fill in the TODOs with the teacher.
2. Check your work: `make starter-test`. Each stage prints how many of its checks pass.
3. See it run: stop the server (`Ctrl+C`), start it again (`make starter-run`), refresh the page, press the stage's button.

## 3. What the note...() calls are for

Every time your code does real work it calls one recording function:

| Call | Meaning | Counted as |
| --- | --- | --- |
| `noteVisit(i)` | I looked at box i | check |
| `noteCompare(a, b)` | I compared box a with box b | check |
| `noteSwap(a, b)` | I swapped boxes a and b | move |
| `noteMove(from, to)` | I copied box from into box to | move |
| `noteSet(i, value)` | I wrote value into box i | move |
| `noteRange(low, high, mid)` | binary search is looking at this window | check |
| `noteFound(i)` | the answer is at i | free |

These calls make the animation and the step counters work. Forget one and the page shows fewer steps than your code really made.

## 4. Code style we use

- Plain arrays: `int seat[ROW_SIZE]`, never `vector`.
- One statement per line, braces on their own lines.
- `i = i + 1`, not `i++`.
- Spelled-out names: `position`, `count`, `smallest`.
- A comment on every line saying what it does.

## 5. If something goes wrong

| Problem | Fix |
| --- | --- |
| `make: command not found` | You are not in WSL/MSYS2. Open the Ubuntu or UCRT64 terminal. |
| Page says the server is offline | Start it again with `make starter-run`. |
| Page still shows old behaviour | You did not restart the server after editing. |
| `address already in use` | Another server is running. Close it, or use `./build/starter/cinema_server 9000` and open port 9000. |
| Lots of red FAIL lines | Normal at the start. They turn into PASS as you finish each TODO. |
