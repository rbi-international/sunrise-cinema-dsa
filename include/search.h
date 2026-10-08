// search.h  (Stage 4: linear search, Stage 6: binary search)
// Every function returns the index of what it found, or -1 when it is not there.

#ifndef SEARCH_H                        // guard: stops this file being included twice
#define SEARCH_H                        // mark the file as included

int findFreeSeat(int seat[], int size);             // first seat holding 0; best O(1), worst O(n)
int linearSearch(int list[], int count, int key);   // works on any list; best O(1), worst O(n)
int binarySearch(int list[], int count, int key);   // list MUST be sorted ascending; O(log n)

#endif                                  // end of the include guard
