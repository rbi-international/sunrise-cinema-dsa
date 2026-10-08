// main_cli.cpp
// Console version of the project. Runs all ten stages in order and prints every checkpoint output.
// Use it in class before the webpage, or when a student's browser is not working.
// Run from the project folder:   ./build/cinema_cli

#include <iostream>                     // cout and endl
#include "config.h"                     // all sizes
#include "step_trace.h"                 // resetTrace, checkCount, moveCount
#include "seat_row.h"                   // Stage 2
#include "waitlist.h"                   // Stage 3
#include "search.h"                     // Stages 4 and 6
#include "sorting.h"                    // Stage 5
#include "merging.h"                    // Stage 7
#include "hall.h"                       // Stage 8
#include "customer_names.h"             // Stage 9
#include "complexity.h"                 // Stage 10
using namespace std;                    // lets us write cout instead of std::cout

void printRow(int seat[], int size)     // [X] booked, [ ] free
{
    for (int i = 0; i < size; i = i + 1)    // every seat
    {
        if (seat[i] == 1)               // booked
        {
            cout << "[X]";
        }
        else                            // free
        {
            cout << "[ ]";
        }
    }
    cout << endl;
}

void printList(int list[], int count)   // values separated by spaces
{
    for (int i = 0; i < count; i = i + 1)   // every filled position
    {
        cout << list[i] << " ";
    }
    cout << endl;
}

int main()
{
    // ===== STAGE 2 =====
    cout << "===== Stage 2: one row =====" << endl;
    int seat[ROW_SIZE];                 // one row of seats
    clearRow(seat, ROW_SIZE);           // all free
    bookSeat(seat, ROW_SIZE, 2);        // book seat 2
    bookSeat(seat, ROW_SIZE, 4);        // book seat 4
    bookSeat(seat, ROW_SIZE, 7);        // book seat 7
    printRow(seat, ROW_SIZE);
    cout << "Size of one int: " << sizeof(int) << " bytes" << endl;
    long long gap = (long long)((char*)&seat[4] - (char*)&seat[0]);    // real distance in bytes
    int formulaGap = addressOf1D(0, sizeof(int), 4, 0);    // formula with Base = 0 gives the distance
    if (gap == formulaGap)
    {
        cout << "Address formula for seat[4]: match (" << gap << " bytes after seat[0])" << endl;
    }
    else
    {
        cout << "Address formula for seat[4]: no match" << endl;
    }
    if (seat[4] == 1 && !bookSeat(seat, ROW_SIZE, 4))  // break-it: book a booked seat
    {
        cout << "Booking seat 4 again is refused" << endl;
    }

    // ===== STAGE 3 =====
    cout << "===== Stage 3: waitlist =====" << endl;
    int waitlist[MAX_WAIT] = {1012, 1005, 1033};
    int waitCount = 3;
    cout << "Start:        ";
    printList(waitlist, waitCount);
    resetTrace();
    waitCount = insertAt(waitlist, waitCount, MAX_WAIT, 1, 1020);
    cout << "Insert 1020:  ";
    printList(waitlist, waitCount);
    cout << "  moves recorded: " << moveCount() << " (2 shifts + 1 write)" << endl;
    waitCount = deleteAt(waitlist, waitCount, 2);
    cout << "Delete pos 2: ";
    printList(waitlist, waitCount);
    int before = waitCount;
    waitCount = insertAt(waitlist, waitCount, MAX_WAIT, 9, 1099);  // break-it: bad position
    if (waitCount == before)
    {
        cout << "Invalid position" << endl;
    }

    // ===== STAGE 4 =====
    cout << "===== Stage 4: linear search =====" << endl;
    bookSeat(seat, ROW_SIZE, 0);
    bookSeat(seat, ROW_SIZE, 1);
    bookSeat(seat, ROW_SIZE, 3);
    printRow(seat, ROW_SIZE);
    resetTrace();
    int freeSeat = findFreeSeat(seat, ROW_SIZE);
    cout << "First free seat: " << freeSeat << " found after " << checkCount() << " checks" << endl;

    // ===== STAGE 5 =====
    cout << "===== Stage 5: sorting =====" << endl;
    int bookings[8] = {1047, 1003, 1029, 1011, 1052, 1018, 1036, 1008};
    int work[8];
    cout << "Unsorted:  ";
    printList(bookings, 8);
    copyList(bookings, work, 8);
    resetTrace();
    bubbleSort(work, 8);
    cout << "Bubble:    ";
    printList(work, 8);
    cout << "  comparisons: " << checkCount() << ", swaps: " << moveCount() << endl;
    copyList(bookings, work, 8);
    resetTrace();
    selectionSort(work, 8);
    cout << "Selection: ";
    printList(work, 8);
    cout << "  comparisons: " << checkCount() << ", swaps: " << moveCount() << endl;
    copyList(bookings, work, 8);
    resetTrace();
    insertionSort(work, 8);
    cout << "Insertion: ";
    printList(work, 8);
    cout << "  comparisons: " << checkCount() << ", shifts and drops: " << moveCount() << endl;

    // ===== STAGE 6 =====
    cout << "===== Stage 6: binary search =====" << endl;
    resetTrace();
    int position = binarySearch(work, 8, 1047);
    cout << "Binary: 1047 at index " << position << " after " << checkCount() << " checks" << endl;
    resetTrace();
    position = linearSearch(work, 8, 1047);
    cout << "Linear: 1047 at index " << position << " after " << checkCount() << " checks" << endl;
    resetTrace();
    position = binarySearch(work, 8, 1050);
    cout << "Binary: 1050 gives " << position << " after " << checkCount() << " checks" << endl;
    position = binarySearch(bookings, 8, 1047);    // trap: unsorted list
    cout << "Binary on UNSORTED list: 1047 gives " << position << endl;

    // ===== STAGE 7 =====
    cout << "===== Stage 7: merging =====" << endl;
    int online[4] = {1003, 1018, 1036, 1047};
    int counter[4] = {1008, 1011, 1029, 1052};
    int allBookings[8];
    int total = mergeSorted(online, 4, counter, 4, allBookings);
    cout << "Merged: ";
    printList(allBookings, total);

    // ===== STAGE 8 =====
    cout << "===== Stage 8: full hall =====" << endl;
    int hall[ROWS][COLS];
    clearHall(hall);
    bookHallSeat(hall, 0, 3);
    bookHallSeat(hall, 2, 3);
    bookHallSeat(hall, 2, 4);
    bookHallSeat(hall, 4, 9);
    for (int r = 0; r < ROWS; r = r + 1)
    {
        cout << "Row " << r << ": ";
        printRow(hall[r], COLS);
    }
    cout << "Booked seats: " << countBooked(hall) << endl;
    long long hallGap = (long long)((char*)&hall[2][3] - (char*)&hall[0][0]);
    cout << "hall[2][3] is " << hallGap << " bytes after hall[0][0]" << endl;
    if (hallGap == rowMajorAddress(0, sizeof(int), 2, 3, 0, 0, COLS))
    {
        cout << "Row-major formula: match" << endl;
    }
    else
    {
        cout << "Row-major formula: no match" << endl;
    }
    cout << "Column-major offset would be " << columnMajorAddress(0, sizeof(int), 2, 3, 0, 0, ROWS) << " bytes" << endl;
    cout << "Hand duel, Base 2000, w 4: row-major " << rowMajorAddress(2000, 4, 2, 3, 0, 0, COLS)
         << ", column-major " << columnMajorAddress(2000, 4, 2, 3, 0, 0, ROWS) << endl;

    // ===== STAGE 9 =====
    cout << "===== Stage 9: customer names =====" << endl;
    char names[MAX_CUSTOMERS][NAME_LEN];
    int nameCount = 0;
    nameCount = addCustomer(names, nameCount, MAX_CUSTOMERS, "Aman");
    nameCount = addCustomer(names, nameCount, MAX_CUSTOMERS, "Simran");
    nameCount = addCustomer(names, nameCount, MAX_CUSTOMERS, "Harpreet");
    for (int i = 0; i < nameCount; i = i + 1)
    {
        cout << names[i] << " has " << myLength(names[i]) << " letters" << endl;
    }
    cout << "Simran found at index " << findCustomer(names, nameCount, "Simran") << endl;
    cout << "Rahul found at index " << findCustomer(names, nameCount, "Rahul") << endl;
    cout << "simran (small s) found at index " << findCustomer(names, nameCount, "simran") << endl;
    toUpperCase(names[2]);
    cout << "Ticket name: " << names[2] << endl;

    // ===== STAGE 10 =====
    cout << "===== Stage 10: complexity =====" << endl;
    static int big[BIG];
    fillSequence(big, BIG);
    int sizes[3] = {10, 100, 1000};
    for (int s = 0; s < 3; s = s + 1)
    {
        int n = sizes[s];
        cout << "n = " << n << ": linear " << worstLinearChecks(big, n) << " checks, binary "
             << worstBinaryChecks(big, n) << " checks" << endl;
    }
    resetTrace();
    cout << "Free seats by scanning (O(n)): " << countFreeSeats(seat, ROW_SIZE) << " after " << checkCount() << " checks" << endl;
    return 0;
}
