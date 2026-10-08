// seat_row.cpp  (Stage 2)
// Picture: seats are equal-sized boxes standing side by side, so we can jump straight to any box.

#include "seat_row.h"                   // our own declarations
#include "step_trace.h"                 // noteVisit, noteSet for counting and animation

void clearRow(int seat[], int size)     // makes every seat free
{
    for (int i = 0; i < size; i = i + 1)    // visit every seat from left to right
    {
        seat[i] = 0;                    // 0 means free
    }
}

bool bookSeat(int seat[], int size, int index)  // books one seat
{
    if (index < 0 || index >= size)     // there is no such seat
    {
        return false;                   // refuse
    }
    noteVisit(index);                   // one direct look at the seat, no walking
    if (seat[index] == 1)               // someone already has it
    {
        return false;                   // refuse
    }
    seat[index] = 1;                    // mark it booked
    noteSet(index, 1);                  // record the write for the animation
    return true;                        // success
}

bool cancelSeat(int seat[], int size, int index)    // frees one seat
{
    if (index < 0 || index >= size)     // there is no such seat
    {
        return false;                   // refuse
    }
    noteVisit(index);                   // one direct look at the seat
    if (seat[index] == 0)               // it is already free
    {
        return false;                   // refuse
    }
    seat[index] = 0;                    // mark it free
    noteSet(index, 0);                  // record the write for the animation
    return true;                        // success
}

int countFreeSeats(int seat[], int size)    // counts free seats by walking the row
{
    int freeCount = 0;                  // nothing counted yet
    for (int i = 0; i < size; i = i + 1)    // visit every seat
    {
        noteVisit(i);                   // one more seat looked at
        if (seat[i] == 0)               // this seat is free
        {
            freeCount = freeCount + 1;  // count it
        }
    }
    return freeCount;                   // give back the total
}

int addressOf1D(int base, int width, int index, int lowerBound)    // address formula
{
    int offset = index - lowerBound;    // how many boxes to skip
    int address = base + width * offset;    // each skipped box is width bytes
    return address;                     // give back the address
}
