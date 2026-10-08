// waitlist.cpp  (Stage 3)
// Picture: people stand on painted floor squares. A newcomer in the middle makes everyone behind step back.

#include "waitlist.h"                   // our own declarations
#include "step_trace.h"                 // noteMove, noteSet for counting and animation

int insertAt(int list[], int count, int capacity, int position, int value)   // returns the new count
{
    if (count == capacity)              // no empty box left at the end
    {
        return count;                   // nothing changes
    }
    if (position < 0 || position > count)   // position must be between 0 and count
    {
        return count;                   // nothing changes
    }
    for (int i = count; i > position; i = i - 1)  // walk from the end back to the gap
    {
        list[i] = list[i - 1];          // move each person one place back
        noteMove(i - 1, i);             // record the shift
    }
    list[position] = value;             // the newcomer takes the empty gap
    noteSet(position, value);           // record the write
    count = count + 1;                  // one more person in the list
    return count;                       // give back the new count
}

int deleteAt(int list[], int count, int position)    // returns the new count
{
    if (position < 0 || position >= count)  // position must point at a real person
    {
        return count;                   // nothing changes
    }
    for (int i = position; i < count - 1; i = i + 1)   // walk from the gap to the end
    {
        list[i] = list[i + 1];          // move each person one place forward
        noteMove(i + 1, i);             // record the shift
    }
    count = count - 1;                  // one less person in the list
    return count;                       // give back the new count
}
