// sorting.cpp  (Stage 5)
// Bubble picture: compare each pair of neighbours, swap if the taller one is in front.
// Selection picture: pick the shortest person, bring them to the front, repeat for the rest.
// Insertion picture: arranging playing cards in your hand.

#include "sorting.h"                    // our own declarations
#include "step_trace.h"                 // noteCompare, noteSwap, noteMove, noteSet

void copyList(int source[], int target[], int count) // copies source into target
{
    for (int i = 0; i < count; i = i + 1)   // visit each position
    {
        target[i] = source[i];          // copy one value
    }
}

bool isSorted(int list[], int count)    // checks the order without changing anything
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
    for (int pass = 0; pass < count - 1; pass = pass + 1)  // count-1 passes are enough
    {
        for (int i = 0; i < count - 1 - pass; i = i + 1)   // the last pass values are already in place
        {
            noteCompare(i, i + 1);      // one comparison made
            if (list[i] > list[i + 1])  // neighbours are in the wrong order
            {
                int temp = list[i];     // keep the left value safe
                list[i] = list[i + 1];  // move the right value left
                list[i + 1] = temp;     // put the saved value on the right
                noteSwap(i, i + 1);     // record the swap
            }
        }
    }
}

void selectionSort(int list[], int count)   // pick the smallest, put it in front
{
    for (int i = 0; i < count - 1; i = i + 1)   // position we are filling now
    {
        int smallest = i;               // assume the current position holds the smallest
        for (int j = i + 1; j < count; j = j + 1)   // look at everything to the right
        {
            noteCompare(j, smallest);   // one comparison made
            if (list[j] < list[smallest])   // found something smaller
            {
                smallest = j;           // remember where it is
            }
        }
        if (smallest != i)              // only swap when the smallest is somewhere else
        {
            int temp = list[i];         // keep the current value safe
            list[i] = list[smallest];   // bring the smallest to position i
            list[smallest] = temp;      // put the saved value where the smallest was
            noteSwap(i, smallest);      // record the swap
        }
    }
}

void insertionSort(int list[], int count)   // like arranging playing cards in your hand
{
    for (int i = 1; i < count; i = i + 1)   // take the next card
    {
        int card = list[i];             // the card we are placing
        int j = i - 1;                  // start comparing with the card to its left
        while (j >= 0)                  // keep going while there are cards on the left
        {
            noteCompare(j, j + 1);      // one comparison: list[j] against the card
            if (list[j] > card)         // this card is bigger, so it moves right
            {
                list[j + 1] = list[j];  // shift the bigger card one place right
                noteMove(j, j + 1);     // record the shift
                j = j - 1;              // look one more place left
            }
            else                        // found a card that is not bigger
            {
                break;                  // stop shifting
            }
        }
        list[j + 1] = card;             // drop the card into the gap
        noteSet(j + 1, card);           // record the drop
    }
}
