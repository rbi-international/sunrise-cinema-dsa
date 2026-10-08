// hall.h  (Stage 8: 2D array, row-major and column-major address)
// The hall is int hall[ROWS][COLS]: hall[r][c] == 1 booked, 0 free. C++ stores it row after row (row-major).

#ifndef HALL_H                          // guard: stops this file being included twice
#define HALL_H                          // mark the file as included

#include "config.h"                     // ROWS and COLS

void clearHall(int hall[][COLS]);       // every seat free, O(ROWS x COLS)
bool bookHallSeat(int hall[][COLS], int row, int column);   // false if outside the hall or already booked, O(1)
bool cancelHallSeat(int hall[][COLS], int row, int column); // false if outside the hall or already free, O(1)
int countBooked(int hall[][COLS]);      // visits every seat, O(ROWS x COLS)
int rowMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int columns);   // Base + w[(i-Lr)N + (j-Lc)]
int columnMajorAddress(int base, int width, int i, int j, int lowRow, int lowCol, int rows);   // Base + w[(j-Lc)M + (i-Lr)]

#endif                                  // end of the include guard
