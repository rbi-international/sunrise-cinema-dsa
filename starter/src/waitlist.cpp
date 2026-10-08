// waitlist.cpp  (Stage 3)  STARTER: fill in every TODO during class.
// Picture: people stand on painted floor squares. A newcomer in the middle makes everyone behind step back.

#include "waitlist.h"                   // our own declarations
#include "step_trace.h"                 // noteMove, noteSet for counting and animation

int insertAt(int list[], int count, int capacity, int position, int value)   // returns the new count
{
    // TODO 1: if count == capacity, the list is full: return count unchanged
    // TODO 2: if position < 0 or position > count: return count unchanged
    // TODO 3: walk i from count DOWN to position + 1:
    //           list[i] = list[i - 1];   then call noteMove(i - 1, i)
    //         (why from the end? try it forward and see who gets lost)
    // TODO 4: list[position] = value;   then call noteSet(position, value)
    // TODO 5: return count + 1
    return count;                       // remove this line when you are done
}

int deleteAt(int list[], int count, int position)    // returns the new count
{
    // TODO 6: if position < 0 or position >= count: return count unchanged
    // TODO 7: walk i from position UP to count - 2:
    //           list[i] = list[i + 1];   then call noteMove(i + 1, i)
    // TODO 8: return count - 1
    return count;                       // remove this line when you are done
}
