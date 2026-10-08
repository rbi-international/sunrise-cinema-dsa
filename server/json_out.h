// json_out.h
// Small helpers that turn our plain arrays into JSON text for the webpage.
// Teacher-provided server code (uses std::string, which student modules do not need).

#ifndef JSON_OUT_H                      // guard: stops this file being included twice
#define JSON_OUT_H                      // mark the file as included

#include <string>                       // std::string
#include "config.h"                     // COLS, NAME_LEN

std::string jsonText(const std::string& text);          // "text" with quotes and special characters escaped
std::string jsonBool(bool value);                       // true or false
std::string jsonInts(const int list[], int count);      // [1,2,3]
std::string jsonHall(int hall[][COLS], int rows);       // [[0,1,...],[...]]
std::string jsonNames(char names[][NAME_LEN], int count);   // ["Aman","Simran"]
std::string jsonTrace();                                // every recorded step as [[type,a,b,c],...]
std::string jsonCost();                                 // "checks":n,"moves":n,"trace":[...] (no braces)

#endif                                  // end of the include guard
