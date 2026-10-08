// sorting.cpp  (Stage 5)  STARTER: fill in every TODO during class.
// Bubble picture: compare each pair of neighbours, swap if the taller one is in front.
// Selection picture: pick the shortest person, bring them to the front, repeat for the rest.
// Insertion picture: arranging playing cards in your hand.

#include "sorting.h"                    // our own declarations
#include "step_trace.h"                 // noteCompare, noteSwap, noteMove, noteSet

void copyList(int source[], int target[], int count) // GIVEN: copies source into target
{
    for (int i = 0; i < count; i = i + 1)   // visit each position
    {
        target[i] = source[i];          // copy one value
    }
}

bool isSorted(int list[], int count)    // GIVEN: checks the order without changing anything
{
    for (int i = 0; i < count - 1; i = i + 1)   // look at each neighbour pair
    {
        if (list[i] > list[i + 1])      // a pair in the wrong order
        {
            return false;               // not sorted
        }
    }
    return true;                        // every pair was fine
}

void bubbleSort(int list[], int count)  // big values bubble to the end
{
    // TODO 1: outer loop: pass from 0 to count - 2
    // TODO 2: inner loop: i from 0 to count - 2 - pass
    //           call noteCompare(i, i + 1)
    //           if list[i] > list[i + 1]: swap them with a temp variable, then call noteSwap(i, i + 1)
}

void selectionSort(int list[], int count)   // pick the smallest, put it in front
{
    // TODO 3: for i from 0 to count - 2:
    //           smallest = i
    //           for j from i + 1 to count - 1:
    //               call noteCompare(j, smallest)
    //               if list[j] < list[smallest]: smallest = j
    //           if smallest != i: swap list[i] and list[smallest], then call noteSwap(i, smallest)
}

void insertionSort(int list[], int count)   // like arranging playing cards in your hand
{
    // TODO 4: for i from 1 to count - 1:
    //           card = list[i];   j = i - 1
    //           while j >= 0:
    //               call noteCompare(j, j + 1)
    //               if list[j] > card: list[j + 1] = list[j]; call noteMove(j, j + 1); j = j - 1
    //               else: break
    //           list[j + 1] = card;   call noteSet(j + 1, card)
}
