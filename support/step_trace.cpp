// step_trace.cpp
// Stores every recorded step in four plain arrays (one per number) plus two counters.
// This file is shared support code: students use it but do not need to change it.

#include "step_trace.h"                 // our own declarations

int typeOf[MAX_EVENTS];                 // the kind of each step
int valueA[MAX_EVENTS];                 // first number of each step
int valueB[MAX_EVENTS];                 // second number of each step
int valueC[MAX_EVENTS];                 // third number of each step
int totalEvents = 0;                    // how many steps are stored
int totalChecks = 0;                    // how many checks happened
int totalMoves = 0;                     // how many moves happened

void addEvent(int type, int a, int b, int c)    // stores one step if there is room
{
    if (totalEvents < MAX_EVENTS)       // still room in the arrays
    {
        typeOf[totalEvents] = type;     // save the kind of step
        valueA[totalEvents] = a;        // save the first number
        valueB[totalEvents] = b;        // save the second number
        valueC[totalEvents] = c;        // save the third number
        totalEvents = totalEvents + 1;  // one more step stored
    }
}

void resetTrace()                       // start a fresh recording
{
    totalEvents = 0;                    // forget stored steps
    totalChecks = 0;                    // checks back to zero
    totalMoves = 0;                     // moves back to zero
}

void noteVisit(int index)               // looked at one box
{
    totalChecks = totalChecks + 1;      // a visit is a check
    addEvent(EVENT_VISIT, index, -1, -1);   // remember it
}

void noteCompare(int first, int second) // compared two boxes
{
    totalChecks = totalChecks + 1;      // a comparison is a check
    addEvent(EVENT_COMPARE, first, second, -1); // remember it
}

void noteSwap(int first, int second)    // swapped two boxes
{
    totalMoves = totalMoves + 1;        // a swap is a move
    addEvent(EVENT_SWAP, first, second, -1);    // remember it
}

void noteMove(int from, int to)         // shifted one box
{
    totalMoves = totalMoves + 1;        // a shift is a move
    addEvent(EVENT_MOVE, from, to, -1); // remember it
}

void noteSet(int index, int value)      // wrote one value
{
    totalMoves = totalMoves + 1;        // a write is a move
    addEvent(EVENT_SET, index, value, -1);  // remember it
}

void noteRange(int low, int high, int mid)  // binary search window
{
    totalChecks = totalChecks + 1;      // checking the middle is a check
    addEvent(EVENT_RANGE, low, high, mid);  // remember it
}

void noteFound(int index)               // the answer
{
    addEvent(EVENT_FOUND, index, -1, -1);   // remember it, but it costs nothing extra
}

void noteTake(int listNumber, int index, int resultIndex)  // merge copied one value
{
    totalMoves = totalMoves + 1;        // a copy is a move
    addEvent(EVENT_TAKE, listNumber, index, resultIndex);   // remember it
}

void noteCell(int row, int column)      // looked at one hall seat
{
    totalChecks = totalChecks + 1;      // a visit is a check
    addEvent(EVENT_CELL, row, column, -1);  // remember it
}

int checkCount()                        // read the check counter
{
    return totalChecks;                 // give it back
}

int moveCount()                         // read the move counter
{
    return totalMoves;                  // give it back
}

int eventCount()                        // read how many steps are stored
{
    return totalEvents;                 // give it back
}

int eventType(int k)                    // read the kind of step k
{
    return typeOf[k];                   // give it back
}

int eventA(int k)                       // read the first number of step k
{
    return valueA[k];                   // give it back
}

int eventB(int k)                       // read the second number of step k
{
    return valueB[k];                   // give it back
}

int eventC(int k)                       // read the third number of step k
{
    return valueC[k];                   // give it back
}
