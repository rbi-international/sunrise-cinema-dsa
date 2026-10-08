// complexity.cpp  (Stage 10)
// Picture: two ushers search a register. A reads every entry; B opens the middle and halves it each time.

#include "complexity.h"                 // our own declarations
#include "search.h"                     // linearSearch, binarySearch
#include "step_trace.h"                 // resetTrace, checkCount

void fillSequence(int list[], int count)    // fills 0, 1, 2, ...
{
    for (int i = 0; i < count; i = i + 1)   // every position
    {
        list[i] = i;                    // value equals its index, so the list is sorted
    }
}

int worstLinearChecks(int list[], int count)    // linear search for the last value
{
    resetTrace();                       // start counting from zero
    linearSearch(list, count, list[count - 1]); // the last value is the worst case
    return checkCount();                // how many checks it took
}

int worstBinaryChecks(int list[], int count)    // binary search for the last value
{
    resetTrace();                       // start counting from zero
    binarySearch(list, count, list[count - 1]); // same value, the fast way
    return checkCount();                // how many checks it took
}

int maxBinaryChecks(int count)          // how many times can n be halved before it reaches 0?
{
    int checks = 0;                     // no halvings yet
    while (count > 0)                   // something is still left
    {
        checks = checks + 1;            // one more check
        count = count / 2;              // throw away half
    }
    return checks;                      // equals floor(log2 n) + 1 for n >= 1
}
