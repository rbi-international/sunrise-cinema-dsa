// complexity.h  (Stage 10: Big-O, Omega, Theta)
// Measures worst-case checks for linear and binary search on a sorted list of size n.

#ifndef COMPLEXITY_H                    // guard: stops this file being included twice
#define COMPLEXITY_H                    // mark the file as included

void fillSequence(int list[], int count);   // list[i] = i, so the list is sorted
int worstLinearChecks(int list[], int count);   // checks linear search needs for the LAST value
int worstBinaryChecks(int list[], int count);   // checks binary search needs for the LAST value
int maxBinaryChecks(int count);         // floor(log2 n) + 1, computed by halving

#endif                                  // end of the include guard
