// customer_names.h  (Stage 9: strings as char arrays)
// A name is a char array that ends with the hidden end marker '\0'.
// The name list is char names[MAX_CUSTOMERS][NAME_LEN]: one name per row.

#ifndef CUSTOMER_NAMES_H                // guard: stops this file being included twice
#define CUSTOMER_NAMES_H                // mark the file as included

#include "config.h"                     // NAME_LEN

int myLength(const char text[]);        // letters before '\0', written by hand, O(L)
void toUpperCase(char text[]);          // a..z become A..Z in place, O(L)
bool sameName(const char first[], const char second[]);     // true if every letter matches, written by hand, O(L)
int addCustomer(char names[][NAME_LEN], int count, int capacity, const char name[]);  // returns new count; unchanged if full, empty or too long
int findCustomer(char names[][NAME_LEN], int count, const char key[]);   // index or -1, O(n x L)

#endif                                  // end of the include guard
