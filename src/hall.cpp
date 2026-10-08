// hall.cpp  (Stage 8)
// Picture: memory is one long corridor of boxes. Row-major lays down row 0, then row 1, and so on.

#include "hall.h"                       // our own declarations
#include "step_trace.h"                 // noteCell

void clearHall(int hall[][COLS])        // makes every seat free
{
    for (int r = 0; r < ROWS; r = r + 1)    // every row
    {
        for (int c = 0; c < COLS; c = c + 1)    // every seat in that row
        {
            hall[r][c] = 0;             // 0 means free
        }
    }
}

bool bookHallSeat(int hall[][COLS], int row, int column)    // books one seat
{
    if (row < 0 || row >= ROWS || column < 0 || column >= COLS) // outside the hall
    {
        return false;                   // refuse
    }
    noteCell(row, column);              // one direct look
    if (hall[row][column] == 1)         // already booked
    {
        return false;                   // refuse
    }
    hall[row][column] = 1;              // mark it booked
    return true;                        // success
}

bool cancelHallSeat(int hall[][COLS], int row, int column)  // frees one seat
{
    if (row < 0 || row >= ROWS || column < 0 || column >= COLS) // outside the hall
    {
        return false;                   // refuse
    }
    noteCell(row, column);              // one direct look
    if (hall[row][column] == 0)         // already free
    {
        return false;                   // refuse
    }
    hall[row][column] = 0;              // mark it free
    return true;                        // success
}

int countBooked(int hall[][COLS])       // counts booked seats in the whole hall
{
    int total = 0;                      // nothing counted yet
    for (int r = 0; r < ROWS; r = r + 1)    // every row
    {
        for (int c = 0; c < COLS; c = c + 1)    // every seat in that row
        {
            noteCell(r, c);             // one more seat looked at
            total = total + hall[r][c]; // adds 1 for booked, 0 for free
        }
    }
    return total;                       // give back the count
}

int rowMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int columns)
{
    int rowsSkipped = i - lowRow;       // full rows before row i
    int seatsSkipped = j - lowCol;      // seats before column j inside row i
    int offset = rowsSkipped * columns + seatsSkipped;  // boxes to skip from the start
    return base + width * offset;       // each box is width bytes
}

int columnMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int rows)
{
    int columnsSkipped = j - lowCol;    // full columns before column j
    int seatsSkipped = i - lowRow;      // seats before row i inside column j
    int offset = columnsSkipped * rows + seatsSkipped;  // boxes to skip from the start
    return base + width * offset;       // each box is width bytes
}
