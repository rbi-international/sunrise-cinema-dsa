# Sunrise Cinema: build file
#
#   make              build server, console app and tests from src/ (complete code)
#   make run          build and start the web server on http://localhost:8080
#   make test         build and run the automatic checks
#   make cli          build and run the console version (all checkpoint outputs)
#
#   make starter-run  same as run, but using starter/src/ (the files students fill in class)
#   make starter-test check how many starter functions are finished
#   make starter-cli  console version using starter/src/
#
#   make clean        delete everything in build/
#
# Works on Linux, macOS, WSL, and Windows with MSYS2 (UCRT64) g++ and mingw32-make.

MODE ?= solution

ifeq ($(MODE),starter)
  SRC_DIR := starter/src
  OUT     := build/starter
  # starter functions have parameters students have not used yet; that is expected
  EXTRA_FLAGS := -Wno-unused-parameter
else
  SRC_DIR := src
  OUT     := build
endif

CXX      ?= g++
CXXFLAGS ?= -std=c++17 -Wall -Wextra -O2
CXXFLAGS += $(EXTRA_FLAGS)
INCLUDES := -Iinclude -Iserver -Ithird_party

ifeq ($(OS),Windows_NT)
  EXE    := .exe
  LDLIBS := -lws2_32
else
  EXE    :=
  LDLIBS := -pthread
endif

MODULES  := seat_row waitlist search sorting merging hall customer_names complexity
OBJ_DIR  := $(OUT)/obj

MODULE_OBJS  := $(addprefix $(OBJ_DIR)/,$(addsuffix .o,$(MODULES))) $(OBJ_DIR)/step_trace.o
SERVER_OBJS  := $(OBJ_DIR)/app_state.o $(OBJ_DIR)/json_out.o $(OBJ_DIR)/routes.o $(OBJ_DIR)/main_server.o
SERVER_FLAGS := -DSOURCE_DIR=\"$(SRC_DIR)\" -DSERVER_MODE=\"$(MODE)\"

SERVER := $(OUT)/cinema_server$(EXE)
CLI    := $(OUT)/cinema_cli$(EXE)
TESTS  := $(OUT)/run_tests$(EXE)

.PHONY: all server cli test run clean starter starter-run starter-test starter-cli

all: $(SERVER) $(CLI) $(TESTS)

server: $(SERVER)

run: $(SERVER)
	./$(SERVER)

cli: $(CLI)
	./$(CLI)

test: $(TESTS)
	./$(TESTS)

starter:
	$(MAKE) MODE=starter all

starter-run:
	$(MAKE) MODE=starter run

starter-test:
	$(MAKE) MODE=starter test

starter-cli:
	$(MAKE) MODE=starter cli

$(SERVER): $(MODULE_OBJS) $(SERVER_OBJS)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LDLIBS)

$(CLI): $(MODULE_OBJS) $(OBJ_DIR)/main_cli.o
	$(CXX) $(CXXFLAGS) $^ -o $@

$(TESTS): $(MODULE_OBJS) $(OBJ_DIR)/test_modules.o
	$(CXX) $(CXXFLAGS) $^ -o $@

# student modules (src/ or starter/src/)
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp include/*.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR)/step_trace.o: support/step_trace.cpp include/step_trace.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR)/app_state.o: server/app_state.cpp server/app_state.h include/*.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR)/json_out.o: server/json_out.cpp server/json_out.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR)/routes.o: server/routes.cpp server/*.h include/*.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) $(SERVER_FLAGS) -c $< -o $@

$(OBJ_DIR)/main_server.o: server/main_server.cpp server/routes.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) $(SERVER_FLAGS) -c $< -o $@

$(OBJ_DIR)/main_cli.o: cli/main_cli.cpp include/*.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR)/test_modules.o: tests/test_modules.cpp include/*.h | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

clean:
	rm -rf build
