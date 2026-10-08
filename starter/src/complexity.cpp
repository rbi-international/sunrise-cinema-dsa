// complexity.cpp  (Stage 10)  STARTER: fill in every TODO during class.
// Picture: two ushers search a register. A reads every entry; B opens the middle and halves it each time.

#include "complexity.h"                 // our own declarations
#include "search.h"                     // linearSearch, binarySearch
#include "step_trace.h"                 // resetTrace, checkCount

void fillSequence(int list[], int count)    // fills 0, 1, 2, ...
{
    // TODO 1: store i in list[i] for every i, so the list is sorted
}

int worstLinearChecks(int list[], int count)    // linear search for the last value
{
    // TODO 2: resetTrace(); linearSearch(list, count, list[count - 1]); return checkCount();
    return 0;                           // remove this line when you are done
}

int worstBinaryChecks(int list[], int count)    // binary search for the last value
{
    // TODO 3: same as above, with binarySearch
    return 0;                           // remove this line when you are done
}

int maxBinaryChecks(int count)          // how many times can n be halved before it reaches 0?
{
    // TODO 4: checks = 0; while count > 0: checks = checks + 1; count = count / 2;
    // TODO 5: return checks   (this equals floor(log2 n) + 1)
    return 0;                           // remove this line when you are done
}
