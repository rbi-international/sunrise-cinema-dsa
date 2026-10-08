// customer_names.cpp  (Stage 9)  STARTER: fill in every TODO during class.
// Picture: a name is a row of letter tiles with a hidden "end" tile after the last letter.

#include "customer_names.h"             // our own declarations
#include "step_trace.h"                 // noteVisit, noteFound
#include <cstring>                      // strcpy

int myLength(const char text[])         // counts letters until the end marker '\0'
{
    // TODO 1: length = 0; while text[length] is not '\0': call noteVisit(length); length = length + 1
    // TODO 2: return length
    return 0;                           // remove this line when you are done
}

void toUpperCase(char text[])           // changes small letters to capital letters
{
    // TODO 3: walk until '\0'; if a letter is between 'a' and 'z', subtract 32
    //         ('a' is 97 and 'A' is 65 in ASCII, a gap of 32)
}

bool sameName(const char first[], const char second[])  // compares letter by letter
{
    // TODO 4: walk while both names still have letters; a different letter means false
    // TODO 5: at the end, they are the same only if BOTH reached '\0' together:
    //         return first[i] == second[i];
    return false;                       // remove this line when you are done
}

int addCustomer(char names[][NAME_LEN], int count, int capacity, const char name[])  // returns new count
{
    // TODO 6: if count == capacity: return count
    // TODO 7: length = myLength(name); if length == 0 or length >= NAME_LEN: return count
    // TODO 8: strcpy(names[count], name); return count + 1
    return count;                       // remove this line when you are done
}

int findCustomer(char names[][NAME_LEN], int count, const char key[])   // returns index or -1
{
    // TODO 9: linear search over the names: call noteVisit(i) for each name;
    //         when sameName(names[i], key) is true, call noteFound(i) and return i
    // TODO 10: return -1 if no name matched
    return -1;                          // remove this line when you are done
}
