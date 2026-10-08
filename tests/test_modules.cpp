// test_modules.cpp
// Automatic checks for every student module. Run with:  make test   (or  make starter-test)
// Each stage prints how many of its checks pass, so students can watch their progress in class.

#include <cstring>
#include <iostream>
#include "config.h"
#include "step_trace.h"
#include "seat_row.h"
#include "waitlist.h"
#include "search.h"
#include "sorting.h"
#include "merging.h"
#include "hall.h"
#include "customer_names.h"
#include "complexity.h"
using namespace std;

int stagePassed = 0;                    // checks passed in the current stage
int stageTotal = 0;                     // checks run in the current stage
int allPassed = 0;                      // checks passed overall
int allTotal = 0;                       // checks run overall

void check(bool condition, const char* description)    // records one check, prints only failures
{
    stageTotal = stageTotal + 1;
    allTotal = allTotal + 1;
    if (condition)
    {
        stagePassed = stagePassed + 1;
        allPassed = allPassed + 1;
    }
    else
    {
        cout << "    FAIL: " << description << endl;
    }
}

void startStage(const char* title)      // begins a group of checks
{
    stagePassed = 0;
    stageTotal = 0;
    cout << title << endl;
}

void endStage()                         // prints the group result
{
    if (stagePassed == stageTotal)
    {
        cout << "    PASS " << stagePassed << "/" << stageTotal << endl;
    }
    else
    {
        cout << "    " << stagePassed << "/" << stageTotal << " passed" << endl;
    }
}

bool sameList(const int a[], const int b[], int count)  // true if both lists hold the same values
{
    for (int i = 0; i < count; i = i + 1)
    {
        if (a[i] != b[i])
        {
            return false;
        }
    }
    return true;
}

void testSeatRow()
{
    startStage("Stage 2  seat_row.cpp");
    int seat[ROW_SIZE];
    for (int i = 0; i < ROW_SIZE; i = i + 1)
    {
        seat[i] = 1;
    }
    clearRow(seat, ROW_SIZE);
    int expectedClear[ROW_SIZE] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    check(sameList(seat, expectedClear, ROW_SIZE), "clearRow makes every seat 0");
    check(bookSeat(seat, ROW_SIZE, 4), "bookSeat on a free seat returns true");
    check(seat[4] == 1, "bookSeat stores 1 in the seat");
    check(!bookSeat(seat, ROW_SIZE, 4), "bookSeat on a booked seat returns false");
    check(!bookSeat(seat, ROW_SIZE, 10), "bookSeat outside the row returns false");
    check(!bookSeat(seat, ROW_SIZE, -1), "bookSeat with a negative index returns false");
    check(cancelSeat(seat, ROW_SIZE, 4), "cancelSeat on a booked seat returns true");
    check(seat[4] == 0, "cancelSeat stores 0 in the seat");
    check(!cancelSeat(seat, ROW_SIZE, 4), "cancelSeat on a free seat returns false");
    bookSeat(seat, ROW_SIZE, 2);
    bookSeat(seat, ROW_SIZE, 7);
    resetTrace();
    check(countFreeSeats(seat, ROW_SIZE) == 8, "countFreeSeats finds 8 free seats");
    check(checkCount() == ROW_SIZE, "countFreeSeats looks at every seat exactly once");
    check(addressOf1D(1000, 4, 4, 0) == 1016, "addressOf1D(1000, 4, 4, 0) is 1016");
    check(addressOf1D(1000, 4, 15, 1) == 1056, "addressOf1D(1000, 4, 15, 1) is 1056");
    endStage();
}

void testWaitlist()
{
    startStage("Stage 3  waitlist.cpp");
    int list[MAX_WAIT] = {1012, 1005, 1033};
    int count = 3;
    resetTrace();
    count = insertAt(list, count, MAX_WAIT, 1, 1020);
    int afterInsert[4] = {1012, 1020, 1005, 1033};
    check(count == 4, "insertAt returns the new count 4");
    check(sameList(list, afterInsert, 4), "insertAt at position 1 gives 1012 1020 1005 1033");
    check(moveCount() == 3, "insertAt at position 1 of 3 makes 2 shifts and 1 write");
    count = deleteAt(list, count, 2);
    int afterDelete[3] = {1012, 1020, 1033};
    check(count == 3, "deleteAt returns the new count 3");
    check(sameList(list, afterDelete, 3), "deleteAt at position 2 gives 1012 1020 1033");
    check(insertAt(list, count, MAX_WAIT, 9, 1099) == 3, "insertAt at an invalid position leaves the count unchanged");
    check(insertAt(list, count, MAX_WAIT, -1, 1099) == 3, "insertAt at a negative position leaves the count unchanged");
    check(deleteAt(list, count, 3) == 3, "deleteAt at position == count leaves the count unchanged");
    count = insertAt(list, count, MAX_WAIT, count, 1040);
    check(count == 4 && list[3] == 1040, "insertAt at the end appends");
    count = insertAt(list, count, MAX_WAIT, 0, 1001);
    check(count == 5 && list[0] == 1001 && list[1] == 1012, "insertAt at the front shifts everyone");
    int full[3] = {1, 2, 3};
    check(insertAt(full, 3, 3, 0, 9) == 3, "insertAt on a full list leaves the count unchanged");
    endStage();
}

void testLinearSearch()
{
    startStage("Stage 4  search.cpp (linear)");
    int seat[ROW_SIZE] = {1, 1, 1, 1, 1, 0, 0, 1, 0, 0};
    resetTrace();
    check(findFreeSeat(seat, ROW_SIZE) == 5, "findFreeSeat returns 5");
    check(checkCount() == 6, "findFreeSeat makes 6 checks to reach seat 5");
    int fullRow[ROW_SIZE] = {1, 1, 1, 1, 1, 1, 1, 1, 1, 1};
    check(findFreeSeat(fullRow, ROW_SIZE) == -1, "findFreeSeat on a full row returns -1");
    int list[8] = {1047, 1003, 1029, 1011, 1052, 1018, 1036, 1008};
    check(linearSearch(list, 8, 1047) == 0, "linearSearch finds the first value at index 0");
    check(linearSearch(list, 8, 1008) == 7, "linearSearch finds the last value at index 7");
    resetTrace();
    check(linearSearch(list, 8, 9999) == -1, "linearSearch returns -1 when absent");
    check(checkCount() == 8, "linearSearch checks all 8 values when absent");
    endStage();
}

void testSorting()
{
    startStage("Stage 5  sorting.cpp");
    int original[8] = {1047, 1003, 1029, 1011, 1052, 1018, 1036, 1008};
    int expected[8] = {1003, 1008, 1011, 1018, 1029, 1036, 1047, 1052};
    int work[8];
    copyList(original, work, 8);
    check(sameList(work, original, 8), "copyList copies every value");
    check(!isSorted(original, 8), "isSorted is false for the booking order");
    check(isSorted(expected, 8), "isSorted is true for ascending order");

    resetTrace();
    bubbleSort(work, 8);
    check(sameList(work, expected, 8), "bubbleSort sorts the bookings");
    check(checkCount() == 28, "bubbleSort makes 8 x 7 / 2 = 28 comparisons");

    copyList(original, work, 8);
    resetTrace();
    selectionSort(work, 8);
    check(sameList(work, expected, 8), "selectionSort sorts the bookings");
    check(checkCount() == 28, "selectionSort makes 28 comparisons");
    check(moveCount() <= 7, "selectionSort makes at most n - 1 = 7 swaps");

    copyList(original, work, 8);
    resetTrace();
    insertionSort(work, 8);
    check(sameList(work, expected, 8), "insertionSort sorts the bookings");
    check(checkCount() == 21, "insertionSort makes 21 comparisons on this data");

    int already[6] = {1, 2, 3, 4, 5, 6};
    resetTrace();
    insertionSort(already, 6);
    check(checkCount() == 5, "insertionSort on sorted data makes only n - 1 = 5 comparisons (best case)");

    int duplicates[6] = {5, 1, 5, 3, 1, 3};
    int duplicatesSorted[6] = {1, 1, 3, 3, 5, 5};
    bubbleSort(duplicates, 6);
    check(sameList(duplicates, duplicatesSorted, 6), "bubbleSort handles repeated values");
    int one[1] = {42};
    selectionSort(one, 1);
    insertionSort(one, 1);
    check(one[0] == 42, "sorting a single value changes nothing");
    endStage();
}

void testBinarySearch()
{
    startStage("Stage 6  search.cpp (binary)");
    int sorted[8] = {1003, 1008, 1011, 1018, 1029, 1036, 1047, 1052};
    resetTrace();
    check(binarySearch(sorted, 8, 1047) == 6, "binarySearch finds 1047 at index 6");
    check(checkCount() == 3, "binarySearch needs 3 checks for 1047");
    resetTrace();
    check(binarySearch(sorted, 8, 1050) == -1, "binarySearch returns -1 for 1050");
    check(checkCount() == 4, "binarySearch needs 4 checks to be sure 1050 is absent");
    check(binarySearch(sorted, 8, 1003) == 0, "binarySearch finds the first value");
    check(binarySearch(sorted, 8, 1052) == 7, "binarySearch finds the last value");
    check(binarySearch(sorted, 0, 1003) == -1, "binarySearch on an empty list returns -1");
    endStage();
}

void testMerging()
{
    startStage("Stage 7  merging.cpp");
    int online[4] = {1003, 1018, 1036, 1047};
    int counter[4] = {1008, 1011, 1029, 1052};
    int expected[8] = {1003, 1008, 1011, 1018, 1029, 1036, 1047, 1052};
    int result[8];
    check(mergeSorted(online, 4, counter, 4, result) == 8, "mergeSorted returns 8");
    check(sameList(result, expected, 8), "mergeSorted gives one sorted list");
    int a[3] = {1, 2, 3};
    int b[2] = {10, 20};
    int expectedAB[5] = {1, 2, 3, 10, 20};
    int out[5];
    check(mergeSorted(a, 3, b, 2, out) == 5 && sameList(out, expectedAB, 5), "mergeSorted copies leftovers of the second list");
    check(mergeSorted(b, 2, a, 3, out) == 5 && sameList(out, expectedAB, 5), "mergeSorted copies leftovers of the first list");
    check(mergeSorted(a, 3, b, 0, out) == 3 && sameList(out, a, 3), "mergeSorted with an empty second list");
    endStage();
}

void testHall()
{
    startStage("Stage 8  hall.cpp");
    int hall[ROWS][COLS];
    for (int r = 0; r < ROWS; r = r + 1)
    {
        for (int c = 0; c < COLS; c = c + 1)
        {
            hall[r][c] = 1;
        }
    }
    clearHall(hall);
    check(countBooked(hall) == 0, "clearHall frees every seat");
    check(bookHallSeat(hall, 2, 3), "bookHallSeat on a free seat returns true");
    check(!bookHallSeat(hall, 2, 3), "bookHallSeat on a booked seat returns false");
    check(!bookHallSeat(hall, 5, 2), "bookHallSeat on row 5 (outside) returns false");
    check(!bookHallSeat(hall, 0, 10), "bookHallSeat on column 10 (outside) returns false");
    bookHallSeat(hall, 0, 3);
    bookHallSeat(hall, 2, 4);
    bookHallSeat(hall, 4, 9);
    resetTrace();
    check(countBooked(hall) == 4, "countBooked finds 4 booked seats");
    check(checkCount() == ROWS * COLS, "countBooked visits all 50 seats");
    check(cancelHallSeat(hall, 4, 9) && countBooked(hall) == 3, "cancelHallSeat frees a booked seat");
    check(rowMajorAddress(2000, 4, 2, 3, 0, 0, 10) == 2092, "row-major address of hall[2][3] with Base 2000 is 2092");
    check(columnMajorAddress(2000, 4, 2, 3, 0, 0, 5) == 2068, "column-major address of hall[2][3] with Base 2000 is 2068");
    check(rowMajorAddress(100, 4, 5, 8, 1, 1, 15) == 368, "exam: row-major A[5][8] in A[1:10][1:15], Base 100 is 368");
    check(columnMajorAddress(100, 4, 5, 8, 1, 1, 10) == 396, "exam: column-major A[5][8] in A[1:10][1:15], Base 100 is 396");
    long long gap = (long long)((char*)&hall[2][3] - (char*)&hall[0][0]);
    check(gap == rowMajorAddress(0, sizeof(int), 2, 3, 0, 0, COLS), "C++ really stores the hall in row-major order");
    endStage();
}

void testNames()
{
    startStage("Stage 9  customer_names.cpp");
    check(myLength("Harpreet") == 8, "myLength(\"Harpreet\") is 8");
    check(myLength("") == 0, "myLength of an empty name is 0");
    char word[NAME_LEN];
    strcpy(word, "Simran Kaur");
    toUpperCase(word);
    check(strcmp(word, "SIMRAN KAUR") == 0, "toUpperCase changes only small letters");
    check(sameName("Aman", "Aman"), "sameName is true for equal names");
    check(!sameName("Aman", "Amandeep"), "sameName is false when one name is longer");
    check(!sameName("simran", "Simran"), "sameName is case-sensitive");
    char names[MAX_CUSTOMERS][NAME_LEN];
    int count = 0;
    count = addCustomer(names, count, MAX_CUSTOMERS, "Aman");
    count = addCustomer(names, count, MAX_CUSTOMERS, "Simran");
    count = addCustomer(names, count, MAX_CUSTOMERS, "Harpreet");
    check(count == 3, "addCustomer stores three names");
    check(addCustomer(names, count, MAX_CUSTOMERS, "") == 3, "addCustomer refuses an empty name");
    check(addCustomer(names, count, MAX_CUSTOMERS, "Abcdefghijklmnopqrstuvwxyz") == 3, "addCustomer refuses a name that does not fit");
    check(findCustomer(names, count, "Simran") == 1, "findCustomer finds Simran at index 1");
    check(findCustomer(names, count, "Rahul") == -1, "findCustomer returns -1 for Rahul");
    endStage();
}

void testComplexity()
{
    startStage("Stage 10 complexity.cpp");
    static int big[BIG];
    fillSequence(big, BIG);
    check(big[0] == 0 && big[999] == 999, "fillSequence puts i in position i");
    check(worstLinearChecks(big, 1000) == 1000, "linear search needs 1000 checks for the last of 1000");
    check(worstBinaryChecks(big, 1000) == 10, "binary search needs 10 checks for the last of 1000");
    check(worstBinaryChecks(big, 10) == 4, "binary search needs 4 checks for the last of 10");
    check(maxBinaryChecks(1000) == 10, "maxBinaryChecks(1000) is 10");
    check(maxBinaryChecks(8) == 4, "maxBinaryChecks(8) is 4");
    check(maxBinaryChecks(1) == 1, "maxBinaryChecks(1) is 1");
    endStage();
}

int main()
{
    cout << "Sunrise Cinema: automatic checks" << endl;
    testSeatRow();
    testWaitlist();
    testLinearSearch();
    testSorting();
    testBinarySearch();
    testMerging();
    testHall();
    testNames();
    testComplexity();
    cout << "TOTAL: " << allPassed << "/" << allTotal << " checks passed" << endl;
    if (allPassed == allTotal)
    {
        return 0;
    }
    return 1;
}
