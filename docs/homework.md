# Homework: problems and test cases

Each problem extends the cinema project. Write the code yourself in the same style (plain arrays, one statement per line). Only the problem and the test cases are given.

| No. | Problem | Input | Expected output |
| --- | --- | --- | --- |
| 1 | Case-insensitive name search: convert both names to capitals before comparing. | Names: Aman, Simran, Harpreet. Key: simran | 1 |
| 1 | (same) | Key: RAHUL | -1 |
| 2 | Bubble sort with a "no swap in this pass, stop" flag. Print passes and comparisons. | 1 2 3 4 5 | Passes: 1, comparisons: 4 |
| 2 | (same) | 5 4 3 2 1 | Passes: 4, comparisons: 10 |
| 3 | Keep a `freeCount` that changes on every booking and cancellation, so "how many free?" is O(1). | Row of 10; book 2, 4, 7; cancel 4 | Free seats: 8 |
| 4 | Print every free seat index in a row. | 1 1 1 1 1 0 0 1 0 0 | 5 6 8 9 |
| 5 | Merge two sorted lists, keeping each ID only once. | {1003, 1008, 1018} and {1008, 1020} | 1003 1008 1018 1020 |
| 6 | Print the number of booked seats in each row of the hall. | Opening-night hall | 1 0 2 0 1 |
| 7 | Find the first row of the hall that has at least k free seats side by side. | Opening-night hall, k = 10 | 1 |
| 8 | Reverse the waitlist in place using two indexes moving towards each other. | 1012 1020 1033 | 1033 1020 1012 |

## Exam-style practice (with answers)

1. A[1:20][1:10], Base = 500, w = 4. Find A[12][6] in row-major and column-major. **Answer:** 500 + 4 × ((12 − 1) × 10 + (6 − 1)) = 960; 500 + 4 × ((6 − 1) × 20 + (12 − 1)) = 944.
2. A[1:50], Base = 1000, w = 4. Find A[15]. **Answer:** 1000 + 4 × (15 − 1) = 1056.
3. Maximum comparisons for binary search on 1000 sorted elements? **Answer:** floor(log2 1000) + 1 = 10.
4. Comparisons made by simple bubble sort on 10 elements? **Answer:** 10 × 9 / 2 = 45.
5. Elements moved when inserting at position 0 of an array holding 50 elements? **Answer:** 50.
6. Which of bubble, selection and insertion sort makes the fewest swaps in the worst case? **Answer:** selection sort, at most n − 1.
7. Why can binary search not be used on an unsorted array? **Answer:** discarding half is valid only when everything left of mid is smaller and everything right is larger.
