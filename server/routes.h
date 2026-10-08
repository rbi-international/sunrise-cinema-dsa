// routes.h
// Connects each web address (for example POST /api/row/book) to a student module function.

#ifndef ROUTES_H                        // guard: stops this file being included twice
#define ROUTES_H                        // mark the file as included

namespace httplib                       // forward declaration so this header stays light
{
    class Server;
}

void registerRoutes(httplib::Server& server);   // adds every /api/... route to the server

#endif                                  // end of the include guard
