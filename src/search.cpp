// search.cpp  (Stages 4 and 6)
// Linear picture: an usher with a torch checks seats one by one.
// Binary picture: the number-guessing game, every guess throws away half of what is left.

#include "search.h"                     // our own declarations
#include "step_trace.h"                 // noteVisit, noteRange, noteFound

int findFreeSeat(int seat[], int size)  // returns the first free seat index, or -1
{
    for (int i = 0; i < size; i = i + 1)    // check seats one by one
    {
        noteVisit(i);                   // one more seat checked
        if (seat[i] == 0)               // found a free seat
        {
            noteFound(i);               // record the answer
            return i;                   // stop and report where it is
        }
    }
    return -1;                          // every seat was booked
}

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

int binarySearch(int list[], int count, int key)     // list must be sorted
{
    int low = 0;                        // left edge of the part still possible
    int high = count - 1;               // right edge of the part still possible
    while (low <= high)                 // something is still left to check
    {
        int mid = (low + high) / 2;     // look at the middle
        noteRange(low, high, mid);      // one more check, and the window for the animation
        if (list[mid] == key)           // found it
        {
            noteFound(mid);             // record the answer
            return mid;                 // report its position
        }
        else if (list[mid] < key)       // key is bigger, so it is on the right
        {
            low = mid + 1;              // throw away the left half
        }
        else                            // key is smaller, so it is on the left
        {
            high = mid - 1;             // throw away the right half
        }
    }
    return -1;                          // key is not in the list
}
