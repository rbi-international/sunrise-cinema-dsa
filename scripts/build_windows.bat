@echo off
rem Builds Sunrise Cinema on Windows without make. Needs g++ (MSYS2 UCRT64 recommended) on PATH.
rem Usage (from the project folder):   scripts\build_windows.bat            complete code (src)
rem                                    scripts\build_windows.bat starter    student code (starter\src)

setlocal
set SRC=src
set OUT=build
set MODE=solution
set EXTRA=
if /I "%1"=="starter" (
  set SRC=starter/src
  set OUT=build\starter
  set MODE=starter
  set EXTRA=-Wno-unused-parameter
)

if not exist %OUT% mkdir %OUT%

set FLAGS=-std=c++17 -Wall -Wextra -O2 %EXTRA% -Iinclude -Iserver -Ithird_party
set MODULES=%SRC%/seat_row.cpp %SRC%/waitlist.cpp %SRC%/search.cpp %SRC%/sorting.cpp %SRC%/merging.cpp %SRC%/hall.cpp %SRC%/customer_names.cpp %SRC%/complexity.cpp support/step_trace.cpp

echo Building server (%MODE%)...
g++ %FLAGS% -DSOURCE_DIR=\"%SRC%\" -DSERVER_MODE=\"%MODE%\" %MODULES% server/app_state.cpp server/json_out.cpp server/routes.cpp server/main_server.cpp -o %OUT%\cinema_server.exe -lws2_32
if errorlevel 1 goto failed

echo Building console app...
g++ %FLAGS% %MODULES% cli/main_cli.cpp -o %OUT%\cinema_cli.exe
if errorlevel 1 goto failed

echo Building tests...
g++ %FLAGS% %MODULES% tests/test_modules.cpp -o %OUT%\run_tests.exe
if errorlevel 1 goto failed

echo.
echo Done. Start the server with:  %OUT%\cinema_server.exe
echo Then open http://localhost:8080
goto end

:failed
echo.
echo Build failed. Check that g++ is installed (MSYS2 UCRT64) and on PATH.
exit /b 1

:end
endlocal
