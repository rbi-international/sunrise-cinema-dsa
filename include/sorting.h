// sorting.h  (Stage 5: bubble, selection and insertion sort)
// All three sort ascending, in place, on a plain int array.

#ifndef SORTING_H                       // guard: stops this file being included twice
#define SORTING_H                       // mark the file as included

void copyList(int source[], int target[], int count);   // target[i] = source[i] for every i
bool isSorted(int list[], int count);   // true if every value is <= the next one
void bubbleSort(int list[], int count); // neighbours swap; big values bubble to the end; O(n^2)
void selectionSort(int list[], int count);  // pick the smallest of the rest each pass; O(n^2), at most n-1 swaps
void insertionSort(int list[], int count);  // slide each card left into place; best O(n), worst O(n^2)

#endif                                  // end of the include guard
