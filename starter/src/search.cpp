// search.cpp  (Stages 4 and 6)  STARTER: fill in every TODO during class.
// Linear picture: an usher with a torch checks seats one by one.
// Binary picture: the number-guessing game, every guess throws away half of what is left.

#include "search.h"                     // our own declarations
#include "step_trace.h"                 // noteVisit, noteRange, noteFound

int findFreeSeat(int seat[], int size)  // returns the first free seat index, or -1
{
    // TODO 1: visit seats from 0 to size - 1; call noteVisit(i) for each look
    // TODO 2: the first seat holding 0: call noteFound(i) and return i
    // TODO 3: after the loop, every seat was booked: return -1
    return -1;                          // remove this line when you are done
}

int linearSearch(int list[], int count, int key)     // returns the index of key, or -1
{
    // TODO 4: same pattern as findFreeSeat, but compare list[i] with key
    return -1;                          // remove this line when you are done
}

int binarySearch(int list[], int count, int key)     // list must be sorted
{
    // TODO 5: low = 0, high = count - 1
    // TODO 6: while low <= high:
    //           mid = (low + high) / 2;   call noteRange(low, high, mid)
    //           if list[mid] == key: call noteFound(mid) and return mid
    //           else if list[mid] < key: low = mid + 1   (throw away the left half)
    //           else: high = mid - 1                     (throw away the right half)
    // TODO 7: return -1 when low passes high
    return -1;                          // remove this line when you are done
}
