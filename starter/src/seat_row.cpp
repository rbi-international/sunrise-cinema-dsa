// seat_row.cpp  (Stage 2)  STARTER: fill in every TODO during class.
// Picture: seats are equal-sized boxes standing side by side, so we can jump straight to any box.
// Check your work with:  make starter-test   and watch it live with:  make starter-run

#include "seat_row.h"                   // our own declarations
#include "step_trace.h"                 // noteVisit, noteSet for counting and animation

void clearRow(int seat[], int size)     // makes every seat free
{
    // TODO 1: visit every seat from 0 to size - 1 and store 0 in it
}

bool bookSeat(int seat[], int size, int index)  // books one seat
{
    // TODO 2: if index is outside 0 .. size - 1, return false
    // TODO 3: call noteVisit(index) to record one direct look at the seat
    // TODO 4: if the seat already holds 1, return false
    // TODO 5: store 1 in the seat, call noteSet(index, 1), and return true
    return false;                       // remove this line when you are done
}

bool cancelSeat(int seat[], int size, int index)    // frees one seat
{
    // TODO 6: same pattern as bookSeat, but the seat must hold 1 and you store 0
    //         (remember noteVisit(index) and noteSet(index, 0))
    return false;                       // remove this line when you are done
}

int countFreeSeats(int seat[], int size)    // counts free seats by walking the row
{
    // TODO 7: start a counter at 0
    // TODO 8: visit every seat; call noteVisit(i) for each one; add 1 when the seat holds 0
    // TODO 9: return the counter
    return 0;                           // remove this line when you are done
}

int addressOf1D(int base, int width, int index, int lowerBound)    // address formula
{
    // TODO 10: LOC(A[i]) = Base + w x (i - LB)
    return 0;                           // remove this line when you are done
}
