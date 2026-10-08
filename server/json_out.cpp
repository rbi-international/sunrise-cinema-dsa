// json_out.cpp
// JSON helpers. Kept deliberately simple: no external JSON library is needed.

#include "json_out.h"                   // our own declarations
#include "step_trace.h"                 // eventCount, eventType, eventA/B/C, checkCount, moveCount
#include <cstdio>                       // snprintf

std::string jsonText(const std::string& text)   // escapes a string for JSON
{
    std::string out = "\"";             // opening quote
    for (size_t i = 0; i < text.size(); i++)    // look at each character
    {
        char ch = text[i];              // current character
        if (ch == '"')                  // a quote must be escaped
        {
            out += "\\\"";
        }
        else if (ch == '\\')            // a backslash must be escaped
        {
            out += "\\\\";
        }
        else if (ch == '\n')            // new line
        {
            out += "\\n";
        }
        else if (ch == '\r')            // carriage return
        {
            out += "\\r";
        }
        else if (ch == '\t')            // tab
        {
            out += "\\t";
        }
        else if ((unsigned char)ch < 0x20)  // any other control character
        {
            char code[8];               // room for \u00XX
            std::snprintf(code, sizeof(code), "\\u%04x", (unsigned char)ch);
            out += code;
        }
        else                            // an ordinary character
        {
            out += ch;
        }
    }
    out += "\"";                        // closing quote
    return out;
}

std::string jsonBool(bool value)        // true or false
{
    if (value)
    {
        return "true";
    }
    return "false";
}

std::string jsonInts(const int list[], int count)   // [a,b,c]
{
    std::string out = "[";
    for (int i = 0; i < count; i++)
    {
        if (i > 0)
        {
            out += ",";
        }
        out += std::to_string(list[i]);
    }
    out += "]";
    return out;
}

std::string jsonHall(int hall[][COLS], int rows)    // one inner list per row
{
    std::string out = "[";
    for (int r = 0; r < rows; r++)
    {
        if (r > 0)
        {
            out += ",";
        }
        out += jsonInts(hall[r], COLS);
    }
    out += "]";
    return out;
}

std::string jsonNames(char names[][NAME_LEN], int count)    // ["a","b"]
{
    std::string out = "[";
    for (int i = 0; i < count; i++)
    {
        if (i > 0)
        {
            out += ",";
        }
        out += jsonText(names[i]);
    }
    out += "]";
    return out;
}

std::string jsonTrace()                 // [[type,a,b,c],...]
{
    std::string out = "[";
    int total = eventCount();
    for (int k = 0; k < total; k++)
    {
        if (k > 0)
        {
            out += ",";
        }
        out += "[" + std::to_string(eventType(k)) + "," + std::to_string(eventA(k)) + ","
             + std::to_string(eventB(k)) + "," + std::to_string(eventC(k)) + "]";
    }
    out += "]";
    return out;
}

std::string jsonCost()                  // checks, moves and the trace together
{
    return "\"checks\":" + std::to_string(checkCount())
         + ",\"moves\":" + std::to_string(moveCount())
         + ",\"trace\":" + jsonTrace();
}
