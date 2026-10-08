// merging.cpp  (Stage 7)
// Picture: two queues sorted by token number meet at one gate; the gatekeeper lets the smaller token in.

#include "merging.h"                    // our own declarations
#include "step_trace.h"                 // noteCompare, noteTake

int mergeSorted(int first[], int firstCount, int second[], int secondCount, int result[])
{
    int i = 0;                          // finger on the first list
    int j = 0;                          // finger on the second list
    int k = 0;                          // next empty box in the result
    while (i < firstCount && j < secondCount)   // both lists still have values
    {
        noteCompare(i, j);              // compare first[i] with second[j]
        if (first[i] <= second[j])      // the first list has the smaller value
        {
            result[k] = first[i];       // take it
            noteTake(0, i, k);          // record: list 0 gave index i to result k
            i = i + 1;                  // move the first finger
        }
        else                            // the second list has the smaller value
        {
            result[k] = second[j];      // take it
            noteTake(1, j, k);          // record: list 1 gave index j to result k
            j = j + 1;                  // move the second finger
        }
        k = k + 1;                      // move to the next empty box
    }
    while (i < firstCount)              // leftovers in the first list
    {
        result[k] = first[i];           // copy one leftover
        noteTake(0, i, k);              // record it
        i = i + 1;                      // move the first finger
        k = k + 1;                      // move to the next empty box
    }
    while (j < secondCount)             // leftovers in the second list
    {
        result[k] = second[j];          // copy one leftover
        noteTake(1, j, k);              // record it
        j = j + 1;                      // move the second finger
        k = k + 1;                      // move to the next empty box
    }
    return k;                           // total values in the result
}
