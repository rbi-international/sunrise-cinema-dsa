# Server API

All endpoints live under `/api`. Parameters travel in the query string. `GET` reads; `POST` changes the cinema. Every response is JSON with `"ok": true | false`.

## Common response shape for actions

```json
{
  "ok": true,
  "message": "1020 joined at position 1",
  "checks": 0,
  "moves": 3,
  "trace": [[4, 2, 3, -1], [4, 1, 2, -1], [5, 1, 1020, -1]],
  "before": [1012, 1005, 1033],
  "state": { "...": "the whole cinema, see below" }
}
```

`trace` is a list of `[type, a, b, c]`. Types (from `include/step_trace.h`, mirrored in `web/js/api.js`):

| Type | Name | a | b | c | Counted as |
| --- | --- | --- | --- | --- | --- |
| 1 | VISIT | index | | | check |
| 2 | COMPARE | first index | second index | | check |
| 3 | SWAP | first index | second index | | move |
| 4 | MOVE | from | to | | move |
| 5 | SET | index | value | | move |
| 6 | RANGE | low | high | mid | check |
| 7 | FOUND | index | | | free |
| 8 | TAKE | list (0 or 1) | index in list | result index | move |
| 9 | CELL | row | column | | check |

At most 6000 events are stored per call; counters keep counting beyond that.

Missing or non-numeric parameters return HTTP 400 with `{"ok": false, "message": "..."}`. A refused operation (seat already booked, invalid position) returns HTTP 200 with `"ok": false`.

## State object

```json
{
  "row": [0,0,1,0,1,0,0,1,0,0],
  "waitlist": [1012,1005,1033], "waitCapacity": 20,
  "bookings": [1047,1003,1029,1011,1052,1018,1036,1008],
  "sorted": [],
  "online": [1003,1018,1036,1047], "counter": [1008,1011,1029,1052],
  "hall": [[0,0,0,1,0,0,0,0,0,0], "... 5 rows"],
  "names": ["Aman","Simran","Harpreet"], "nameCapacity": 10, "nameLength": 20,
  "sizeofInt": 4,
  "mode": "solution"
}
```

## Endpoints

| Method | Path | Parameters | Calls | Extra fields |
| --- | --- | --- | --- | --- |
| GET | `/api/info` | | | `mode`, `sourceDir`, `sizeofInt` |
| GET | `/api/state` | | | `state` |
| POST | `/api/reset` | | `resetState` | |
| GET | `/api/source` | `module` (seat_row, waitlist, search, sorting, merging, hall, customer_names, complexity) | | `path`, `code` |
| POST | `/api/row/book` | `seat` | `bookSeat` | `seat` |
| POST | `/api/row/cancel` | `seat` | `cancelSeat` | `seat` |
| GET | `/api/row/count-free` | | `countFreeSeats` | `result` |
| GET | `/api/row/address` | `index`, `base`=1000, `width`=sizeof(int), `lb`=0 | `addressOf1D` | `formula`, `realOffsetBytes`, `realMatchesFormula` |
| POST | `/api/waitlist/insert` | `position`, `value` | `insertAt` | `before` |
| POST | `/api/waitlist/delete` | `position` | `deleteAt` | `before` |
| GET | `/api/search/free-seat` | | `findFreeSeat` | `result` |
| GET | `/api/search/linear` | `key` | `linearSearch` on bookings | `result`, `list` |
| GET | `/api/search/binary` | `key`, `list`=sorted or unsorted | `binarySearch` | `result`, `list`, `listName` (HTTP 409 if nothing sorted yet) |
| POST | `/api/bookings/shuffle` | | | |
| POST | `/api/bookings/set` | `values` = "1047,1003,..." (2 to 16) | | |
| POST | `/api/sort` | `algorithm` = bubble, selection, insertion | the sort, on a copy | `algorithm`, `before`, `after` |
| GET | `/api/sort/compare` | `n` = 2 to 300 (default 50) | all three sorts on sorted, random (fixed seed) and reversed data | `rows[]` with `checks`, `moves`, `sortedOk` |
| GET | `/api/merge` | | `mergeSorted` | `result` |
| POST | `/api/merge/set` | `online`, `counter` (sorted lists) | | |
| POST | `/api/hall/book` | `row`, `col` | `bookHallSeat` | |
| POST | `/api/hall/cancel` | `row`, `col` | `cancelHallSeat` | |
| GET | `/api/hall/count` | | `countBooked` | `result` |
| GET | `/api/hall/address` | `row`, `col`, `base`=2000, `width`=sizeof(int), `lr`=0, `lc`=0, `rows`=5, `cols`=10 | `rowMajorAddress`, `columnMajorAddress` | `rowMajor`, `columnMajor`, `realOffsetBytes`, `realMatchesRowMajor` |
| POST | `/api/names/add` | `name` | `addCustomer` | |
| GET | `/api/names/find` | `name` | `findCustomer` | `result` |
| GET | `/api/names/inspect` | `name` | `myLength`, `toUpperCase` | `length`, `upper`, `asciiCodes` |
| GET | `/api/complexity` | `sizes` = "10,100,1000" (up to 8, each 1 to 1000) | `worstLinearChecks`, `worstBinaryChecks`, `maxBinaryChecks` | `rows[]` |

The server binds to `127.0.0.1` only, so it is not reachable from other machines on the network.
