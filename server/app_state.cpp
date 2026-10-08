// app_state.cpp
// The opening-night data. These values match the checkpoint outputs in docs/teaching_guide.md.

#include "app_state.h"                  // our own declarations
#include "seat_row.h"                   // clearRow, bookSeat
#include "hall.h"                       // clearHall, bookHallSeat
#include "customer_names.h"             // addCustomer
#include "step_trace.h"                 // resetTrace

void resetState(AppState& state)        // fills the cinema with the starting data
{
    clearRow(state.row, ROW_SIZE);      // all seats free
    state.row[2] = 1;                   // seat 2 booked
    state.row[4] = 1;                   // seat 4 booked
    state.row[7] = 1;                   // seat 7 booked

    int waiting[3] = {1012, 1005, 1033};    // three people on the waitlist
    for (int i = 0; i < 3; i = i + 1)   // copy them in
    {
        state.waitlist[i] = waiting[i]; // one ID
    }
    state.waitCount = 3;                // three waiting

    int booked[8] = {1047, 1003, 1029, 1011, 1052, 1018, 1036, 1008};   // booking order
    for (int i = 0; i < 8; i = i + 1)   // copy them in
    {
        state.bookings[i] = booked[i];  // one ID
    }
    state.bookingCount = 8;             // eight bookings
    state.sortedCount = 0;              // nothing sorted yet

    int fromApp[4] = {1003, 1018, 1036, 1047};  // online list, sorted
    int fromDesk[4] = {1008, 1011, 1029, 1052}; // counter list, sorted
    for (int i = 0; i < 4; i = i + 1)   // copy both lists
    {
        state.online[i] = fromApp[i];   // one online ID
        state.counter[i] = fromDesk[i]; // one counter ID
    }
    state.onlineCount = 4;              // four online
    state.counterCount = 4;             // four at the counter

    clearHall(state.hall);              // every hall seat free
    state.hall[0][3] = 1;               // row 0 seat 3
    state.hall[2][3] = 1;               // row 2 seat 3
    state.hall[2][4] = 1;               // row 2 seat 4
    state.hall[4][9] = 1;               // row 4 seat 9

    state.nameCount = 0;                // no names yet
    state.nameCount = addCustomer(state.names, state.nameCount, MAX_CUSTOMERS, "Aman");     // first name
    state.nameCount = addCustomer(state.names, state.nameCount, MAX_CUSTOMERS, "Simran");   // second name
    state.nameCount = addCustomer(state.names, state.nameCount, MAX_CUSTOMERS, "Harpreet"); // third name

    resetTrace();                       // the setup steps are not part of any lesson
}
