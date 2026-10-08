// waitlist.h  (Stage 3: insertion and deletion at a position)
// The waitlist is an int array of ticket IDs with a separate count of how many are filled.
// Both functions return the NEW count. If the job is not possible, the count comes back unchanged.

#ifndef WAITLIST_H                      // guard: stops this file being included twice
#define WAITLIST_H                      // mark the file as included

int insertAt(int list[], int count, int capacity, int position, int value);    // shifts right from the end, O(n)
int deleteAt(int list[], int count, int position);  // shifts left from the gap, O(n)

#endif                                  // end of the include guard
