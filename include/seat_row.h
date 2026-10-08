// seat_row.h  (Stage 2: one row, 1D array, traversal, address of an element)
// A row is an int array: seat[i] == 1 means booked, seat[i] == 0 means free.
// Seat numbers start at 0, exactly like array indexes.

#ifndef SEAT_ROW_H                      // guard: stops this file being included twice
#define SEAT_ROW_H                      // mark the file as included

void clearRow(int seat[], int size);    // makes every seat free (traversal, O(n))
bool bookSeat(int seat[], int size, int index);     // books seat index; false if index is invalid or already booked (O(1))
bool cancelSeat(int seat[], int size, int index);   // frees seat index; false if index is invalid or already free (O(1))
int countFreeSeats(int seat[], int size);           // counts free seats by visiting every seat (O(n))
int addressOf1D(int base, int width, int index, int lowerBound);    // LOC(A[i]) = Base + w x (i - LB)

#endif                                  // end of the include guard
