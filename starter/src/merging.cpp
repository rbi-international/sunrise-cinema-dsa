// merging.cpp  (Stage 7)  STARTER: fill in every TODO during class.
// Picture: two queues sorted by token number meet at one gate; the gatekeeper lets the smaller token in.

#include "merging.h"                    // our own declarations
#include "step_trace.h"                 // noteCompare, noteTake

int mergeSorted(int first[], int firstCount, int second[], int secondCount, int result[])
{
    // TODO 1: three fingers: i = 0 (first list), j = 0 (second list), k = 0 (result)
    // TODO 2: while i < firstCount AND j < secondCount:
    //           call noteCompare(i, j)
    //           if first[i] <= second[j]: result[k] = first[i]; call noteTake(0, i, k); i = i + 1
    //           else: result[k] = second[j]; call noteTake(1, j, k); j = j + 1
    //           k = k + 1
    // TODO 3: copy leftovers of the first list  (call noteTake(0, i, k) for each)
    // TODO 4: copy leftovers of the second list (call noteTake(1, j, k) for each)
    // TODO 5: return k
    return 0;                           // remove this line when you are done
}
