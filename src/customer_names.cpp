// customer_names.cpp  (Stage 9)
// Picture: a name is a row of letter tiles with a hidden "end" tile after the last letter.

#include "customer_names.h"             // our own declarations
#include "step_trace.h"                 // noteVisit
#include <cstring>                      // strcpy

int myLength(const char text[])         // counts letters until the end marker '\0'
{
    int length = 0;                     // no letters counted yet
    while (text[length] != '\0')        // stop at the hidden end marker
    {
        noteVisit(length);              // one more letter looked at
        length = length + 1;            // one more letter
    }
    return length;                      // give back the count
}

void toUpperCase(char text[])           // changes small letters to capital letters
{
    int i = 0;                          // start at the first letter
    while (text[i] != '\0')             // until the end marker
    {
        if (text[i] >= 'a' && text[i] <= 'z')   // a small letter
        {
            text[i] = text[i] - 32;     // 'a' is 97 and 'A' is 65 in ASCII, a gap of 32
        }
        i = i + 1;                      // next letter
    }
}

bool sameName(const char first[], const char second[])  // compares letter by letter
{
    int i = 0;                          // start at the first letter
    while (first[i] != '\0' && second[i] != '\0')   // both names still have letters
    {
        if (first[i] != second[i])      // a letter differs
        {
            return false;               // not the same name
        }
        i = i + 1;                      // next letter
    }
    return first[i] == second[i];       // same only if both ended at the same place
}

int addCustomer(char names[][NAME_LEN], int count, int capacity, const char name[])  // returns new count
{
    if (count == capacity)              // no row left in the name list
    {
        return count;                   // nothing changes
    }
    int length = myLength(name);        // how many letters the new name has
    if (length == 0 || length >= NAME_LEN)  // empty, or no room for the end marker
    {
        return count;                   // nothing changes
    }
    strcpy(names[count], name);         // copy every letter and the end marker
    count = count + 1;                  // one more name stored
    return count;                       // give back the new count
}

int findCustomer(char names[][NAME_LEN], int count, const char key[])   // returns index or -1
{
    for (int i = 0; i < count; i = i + 1)   // check names one by one
    {
        noteVisit(i);                   // one more name checked
        if (sameName(names[i], key))    // same letters in the same order
        {
            noteFound(i);               // record the answer
            return i;                   // report the position
        }
    }
    return -1;                          // name not found
}
