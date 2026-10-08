// config.h
// Every fixed size used by the project lives here, so one change updates the whole program.

#ifndef CONFIG_H                        // guard: stops this file being included twice
#define CONFIG_H                        // mark the file as included

const int ROW_SIZE = 10;                // seats in one row (Stage 2)
const int MAX_WAIT = 20;                // most people the waitlist can hold (Stage 3)
const int MAX_BOOKINGS = 16;            // most ticket IDs in the booking list (Stages 5 to 7)
const int ROWS = 5;                     // rows in the full hall (Stage 8)
const int COLS = 10;                    // seats per row in the full hall (Stage 8)
const int NAME_LEN = 20;                // longest name we store, including the end marker '\0' (Stage 9)
const int MAX_CUSTOMERS = 10;           // most customer names we store (Stage 9)
const int BIG = 1000;                   // size of the large test list (Stage 10)

#endif                                  // end of the include guard
