// hall.cpp  (Stage 8)  STARTER: fill in every TODO during class.
// Picture: memory is one long corridor of boxes. Row-major lays down row 0, then row 1, and so on.

#include "hall.h"                       // our own declarations
#include "step_trace.h"                 // noteCell

void clearHall(int hall[][COLS])        // makes every seat free
{
    // TODO 1: two nested loops (rows outside, columns inside); store 0 in every seat
}

bool bookHallSeat(int hall[][COLS], int row, int column)    // books one seat
{
    // TODO 2: refuse (return false) if row is outside 0 .. ROWS - 1 or column outside 0 .. COLS - 1
    // TODO 3: call noteCell(row, column)
    // TODO 4: refuse if the seat already holds 1; otherwise store 1 and return true
    return false;                       // remove this line when you are done
}

bool cancelHallSeat(int hall[][COLS], int row, int column)  // frees one seat
{
    // TODO 5: same pattern as bookHallSeat, but the seat must hold 1 and you store 0
    return false;                       // remove this line when you are done
}

int countBooked(int hall[][COLS])       // counts booked seats in the whole hall
{
    // TODO 6: nested loops over every seat; call noteCell(r, c) for each; add hall[r][c] to a total
    return 0;                           // remove this line when you are done
}

int rowMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int columns)
{
    // TODO 7: Base + w x [ (i - Lr) x N + (j - Lc) ]     (N = columns)
    return 0;                           // remove this line when you are done
}

int columnMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int rows)
{
    // TODO 8: Base + w x [ (j - Lc) x M + (i - Lr) ]     (M = rows)
    return 0;                           // remove this line when you are done
}
