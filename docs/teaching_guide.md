# Teaching guide: Unit I in one 2-hour live class

Students build the cinema's C++ modules with you, one stage at a time, and the web page animates their own code as soon as each function works. Every number in this guide comes from the real program (see `expected_cli_output.txt`).

## Before class

| When | What |
| --- | --- |
| Day before | Share the repo link. Students install g++ and make (see `student_guide.md`) and run `make starter-run` once to prove the setup works. |
| 10 minutes before | On your machine: `make starter-run` in one terminal (the students' view), `make run` on port 8080 in another if you want the finished version for comparison (`./build/cinema_server 9000` for a second port). |
| Screen | Editor with `starter/src/` on the left, browser on the right. Keep `make starter-test` ready in a terminal. |
| Polls | Mentimeter or the platform poll, with the predict questions below. |

Fallback for a student whose setup fails: they follow in OnlineGDB using `cli/main_cli.cpp` logic, or pair with a classmate on screen share. Do not spend class time debugging installs.

## The rhythm of every stage

1. **Picture.** Open the stage on the page. Read the handwritten story line aloud. Act it out on the whiteboard.
2. **Predict.** Ask the stage's prediction question; answers in chat.
3. **Type together.** Open the starter file. Fill the numbered TODOs together, reading each comment aloud.
4. **Check.** `make starter-test` shows that stage's checks turning green. Restart the server (`Ctrl+C`, `make starter-run`), refresh, press the stage's button, and watch the animation run on the code just written.

## Timeline

| Clock | Stage | Student file | Main activity |
| --- | --- | --- | --- |
| 0:00 to 0:08 | 1. The hall | none | Story hook, term cards, poll |
| 0:08 to 0:20 | 2. One row | `seat_row.cpp` TODO 1 to 10 | Book seats, traversal, address calculator |
| 0:20 to 0:35 | 3. Waitlist | `waitlist.cpp` TODO 1 to 8 | Insert and delete; break-it challenge |
| 0:35 to 0:45 | 4. Free seat | `search.cpp` TODO 1 to 4 | Torch search with step counter |
| 0:45 to 1:05 | 5. Sorting | `sorting.cpp` TODO 1 to 4 | Bubble and selection live; insertion if time |
| 1:05 to 1:15 | 6. Binary search | `search.cpp` TODO 5 to 7 | Step race; unsorted trap |
| 1:15 to 1:25 | 7. Merge | `merging.cpp` TODO 1 to 5 | Gatekeeper with two volunteers |
| 1:25 to 1:40 | 8. Full hall | `hall.cpp` TODO 1 to 8 | Hand calculation duel, memory corridor |
| 1:40 to 1:50 | 9. Names | `customer_names.cpp` TODO 1 to 10 | Letter tiles, case trap |
| 1:50 to 2:00 | 10. Complexity | `complexity.cpp` TODO 1 to 5 | Growth chart, final cost table, cliffhanger |

If you fall behind, Stage 5 is where to save time: type bubble sort only, show insertion sort with the finished server, and assign the rest as homework from the same file.

## Stage 1: The hall (0:00 to 0:08)

**Say first:** "It is opening night. The 7 PM show is sold out, and at 6 PM the booking software crashed. We rebuild it, piece by piece, before the show starts."

**On the page:** click each term card; the hall picture highlights what it means (one seat, one row, the whole hall, a ticket record, the booking desk as an ADT).

**Poll:** "Which is faster for the desk: going straight to seat 7, or finding the first empty seat?" Most answer "about the same". Keep the result; Stage 4 settles it.

**Takeaway:** every arrangement makes some jobs cheap and some costly.

## Stage 2: One row (0:08 to 0:20)

**Picture:** equal boxes side by side, so you can jump straight to box 4 without checking boxes 0 to 3.

**Students type:** `clearRow`, `bookSeat`, `cancelSeat`, `countFreeSeats`, `addressOf1D`.

**Formula:**

```
LOC(A[i]) = Base + w × (i − LB)          Base = 1000, w = 4, LB = 0, i = 4  →  1016
```

**On the page:** click seats (one check each, O(1)); press "Count free seats" (ten visits, O(n)); the address calculator also asks the real C++ program for `&seat[4] − &seat[0]` and shows 16 bytes.

**Predict:** "Which boxes show X after booking seats 2, 4 and 7?" Students who count from 1 say 3, 5 and 8; the row settles it.

**Checkpoint (make cli):**

```
[ ][ ][X][ ][X][ ][ ][X][ ][ ]
Size of one int: 4 bytes
Address formula for seat[4]: match (16 bytes after seat[0])
```

**Watch out:** indexes start at 0, and never hard-code int as 2 bytes.

## Stage 3: The waitlist (0:20 to 0:35)

**Picture:** a VIP joins at square 1, so everyone from square 1 onward steps back, starting from the last person.

**Students type:** `insertAt` (TODO 1 to 5), `deleteAt` (TODO 6 to 8).

```
insert at p : moves = n − p        best O(1) at the end, worst O(n) at the front
delete at p : moves = n − p − 1
```

**On the page:** insert 1020 at position 1; the animation shifts 1033, then 1005, then drops 1020 in. Counters: 0 checks, 3 moves (2 shifts and 1 write).

**Break-it (5 minutes):** have students run the shift loop forward. Output becomes 1012 1020 1005 1005: 1033 is lost. Then try position 9 and position −1; the page must say "Invalid position" and the list must not change.

**Checkpoint:**

```
Start:        1012 1005 1033
Insert 1020:  1012 1020 1005 1033
Delete pos 2: 1012 1020 1033
Invalid position
```

## Stage 4: Find a free seat (0:35 to 0:45)

**Picture:** an usher with a torch, one look per seat.

**Students type:** `findFreeSeat`, `linearSearch` (`search.cpp` TODO 1 to 4).

**On the page:** press "Class example: also book seats 0, 1, 3", then "Find first free seat". The torch visits seats 0 to 5: **6 checks**. Ask why not 5 (indexes 0 to 5 are six seats). Reveal the Stage 1 poll: going to seat 7 was 1 check; finding a seat grows with the row.

| Case | Checks | Bound |
| --- | --- | --- |
| Key at index 0 | 1 | Ω(1) |
| Average (key present) | about (n + 1) / 2 | Θ(n) |
| Last or absent | n | O(n) |

## Stage 5: Sort the tickets (0:45 to 1:05)

**Pictures:** bubble (neighbours swap), selection (pick the shortest, bring to the front), insertion (playing cards).

**Students type:** `bubbleSort`, `selectionSort`, `insertionSort` (`copyList` and `isSorted` are given).

**On the page:** the bars animate every comparison (purple) and swap or shift (red). On the 8 bookings:

| Sort | Comparisons | Moves |
| --- | --- | --- |
| Bubble | 28 | 15 swaps |
| Selection | 28 | 7 swaps |
| Insertion | 21 | 22 shifts and drops |

n(n − 1)/2 = 8 × 7 / 2 = 28. Then press "Run all three sorts" with n = 50: insertion sort on already-sorted data makes only 49 comparisons (its O(n) best case), while bubble and selection still make 1225.

**Engagement:** five students type random numbers in chat; sort them by hand with bubble sort, saying "swap" or "keep" for each pair.

## Stage 6: Find a ticket fast (1:05 to 1:15)

**Picture:** the number-guessing game; every guess throws away half.

**Students type:** `binarySearch` (`search.cpp` TODO 5 to 7). Keep `mid = (low + high) / 2`; the overflow-safe form comes later in the course.

```
mid = (low + high) / 2        maximum checks = floor(log2 n) + 1
```

**On the page:** search 1047. The window narrows: mid 3 (1018), mid 5 (1036), mid 6 (found). **3 checks**, against 7 for linear search on the same list. Search 1050: −1 after 4 checks.

**Trap:** press "Try it on the UNSORTED list" with key 1047. Binary search answers "not found" while 1047 sits at index 0. Sorting is the price of fast search.

## Stage 7: Merge the bookings (1:15 to 1:25)

**Picture:** two sorted queues meet at one gate; the gatekeeper lets the smaller token through.

**Students type:** `mergeSorted` (TODO 1 to 5).

**On the page:** fingers i and j move along the two lists; result fills left to right. 7 comparisons, 8 copies, O(m + n).

**Engagement:** two volunteers on camera each read out the front of their list; you announce who goes in. Then delete the two leftover loops: 1052 disappears.

## Stage 8: The full hall (1:25 to 1:40)

**Picture:** memory is one long corridor. Row-major lays down row 0, then row 1. Row 2, Seat 3 is 2 × 10 + 3 = 23 boxes from the start.

**Students type:** `clearHall`, `bookHallSeat`, `cancelHallSeat`, `countBooked`, `rowMajorAddress`, `columnMajorAddress`.

```
Row-major:    LOC(A[i][j]) = Base + w × [(i − Lr) × N + (j − Lc)]
Column-major: LOC(A[i][j]) = Base + w × [(j − Lc) × M + (i − Lr)]
```

**Hand calculation duel (before pressing anything):** hall[5][10], Base 2000, w 4, find hall[2][3]. Row-major 2000 + 4 × 23 = **2092**; column-major 2000 + 4 × 17 = **2068**. Then press Calculate: the page also shows that the real C++ hall has `&hall[2][3]` exactly 92 bytes after `&hall[0][0]`, so C++ really is row-major. Toggle the memory corridor between row-major and column-major to see the 23 and 17 skipped boxes.

**Exam example button:** A[1:10][1:15], Base 100, w 4, A[5][8]: row-major 368, column-major 396.

**Count booked seats:** nested loops visit all 50 seats: O(M × N).

**Watch out:** `hall[5][2]` does not exist, yet the code usually compiles and runs without complaint.

## Stage 9: Customer names (1:40 to 1:50)

**Picture:** letter tiles with a hidden end tile.

**Students type:** `myLength`, `toUpperCase`, `sameName`, `addCustomer`, `findCustomer`.

**On the page:** inspect "Simran": six letter tiles, then `\0`, with ASCII codes 83 105 109 114 97 110 0. Length 6, array needs 7 boxes. Capitals: SIMRAN (each small letter minus 32).

**Trap:** find "simran" with a small s: not found, because 's' is 115 and 'S' is 83. Homework: make the search ignore case.

## Stage 10: The manager's question (1:50 to 2:00)

**Picture:** two ushers; one reads every entry, one halves the register.

**Students type:** `complexity.cpp` TODO 1 to 5.

**On the page:** press Measure with 10,100,1000:

| n | Linear (worst) | Binary (worst) |
| --- | --- | --- |
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1000 | 1000 | 10 |

Size grew 100 times; linear work grew 100 times; binary work grew from 4 to 10.

**Time-space tradeoff:** keep one extra `freeCount`, updated on every booking and cancellation, and "how many seats are free?" becomes O(1) instead of an O(n) scan.

**Final cost table:** scroll down. The last column shows what the class actually measured on each stage in this browser.

**Cliffhanger (last minute):** "Our waitlist is slow because every VIP makes everyone shift. What if each person only remembered who stands behind them, so nobody has to move?" That is the linked list, and it opens Unit II.

## Common live-class problems

| Symptom | Cause and fix |
| --- | --- |
| Page says the server is offline | Server stopped or crashed. `make starter-run` again, refresh. |
| Animation does not change after editing code | Server still runs the old build. `Ctrl+C`, then `make starter-run`. |
| `make: command not found` on Windows | Use WSL or MSYS2 UCRT64, or `scripts\build_windows.bat`. |
| Port 8080 busy | `./build/starter/cinema_server 9000`, open `http://localhost:9000`. |
| Binary search returns −1 for a present ticket | It is searching the unsorted list. Sort in Stage 5 first. |
| Sort results differ between sorts | A swap is missing its `temp` variable or the inner loop bound is off by one. |
