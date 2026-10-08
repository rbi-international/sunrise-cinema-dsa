// step_trace.h
// The "step recorder". Every algorithm calls one note...() function each time it does real work.
// This does two jobs:
//   1. it counts steps, so we can measure cost (Stage 10)
//   2. it remembers each step, so the webpage can replay the algorithm as an animation
//
// Counting rule used in the whole project:
//   checks   = looking at or comparing a value  (noteVisit, noteCompare, noteRange, noteCell)
//   moves    = changing where a value sits      (noteSwap, noteMove, noteSet, noteTake)

#ifndef STEP_TRACE_H                    // guard: stops this file being included twice
#define STEP_TRACE_H                    // mark the file as included

const int MAX_EVENTS = 6000;            // most steps we remember for one run

const int EVENT_VISIT = 1;              // looked at one box: a = index
const int EVENT_COMPARE = 2;            // compared two boxes: a = first index, b = second index
const int EVENT_SWAP = 3;               // swapped two boxes: a, b = the two indexes
const int EVENT_MOVE = 4;               // copied a box to another place: a = from, b = to
const int EVENT_SET = 5;                // wrote a value: a = index, b = value
const int EVENT_RANGE = 6;              // binary search window: a = low, b = high, c = mid
const int EVENT_FOUND = 7;              // answer found: a = index
const int EVENT_TAKE = 8;               // merge took a value: a = list (0 or 1), b = index in that list, c = result index
const int EVENT_CELL = 9;               // looked at a hall seat: a = row, b = column

void resetTrace();                      // forget old steps, set both counters to 0

void noteVisit(int index);              // record: looked at list[index]
void noteCompare(int first, int second);    // record: compared list[first] with list[second]
void noteSwap(int first, int second);   // record: swapped list[first] and list[second]
void noteMove(int from, int to);        // record: list[to] = list[from]
void noteSet(int index, int value);     // record: list[index] = value
void noteRange(int low, int high, int mid); // record: binary search is looking at low..high, middle mid
void noteFound(int index);              // record: the answer is at index
void noteTake(int listNumber, int index, int resultIndex);  // record: merge copied a value into result
void noteCell(int row, int column);     // record: looked at hall[row][column]

int checkCount();                       // how many checks since the last resetTrace()
int moveCount();                        // how many moves since the last resetTrace()
int eventCount();                       // how many steps are remembered
int eventType(int k);                   // type of step number k
int eventA(int k);                      // first number stored with step k
int eventB(int k);                      // second number stored with step k
int eventC(int k);                      // third number stored with step k

#endif                                  // end of the include guard
