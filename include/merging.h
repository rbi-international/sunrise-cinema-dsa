// merging.h  (Stage 7: merging two sorted arrays)
// Both input lists must already be sorted ascending. result must have room for firstCount + secondCount values.

#ifndef MERGING_H                       // guard: stops this file being included twice
#define MERGING_H                       // mark the file as included

int mergeSorted(int first[], int firstCount, int second[], int secondCount, int result[]);  // returns total; O(m + n)

#endif                                  // end of the include guard
