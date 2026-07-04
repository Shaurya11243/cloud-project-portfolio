cmake_minimum_required(VERSION 3.10)
project(LibraryManagementSystemTest)
set(CMAKE_CXX_STANDARD 17)

enable_testing()

add_library(library src/library.cpp)
add_executable(runTests test/test_library.cpp)
target_link_libraries(runTests  library gtest gtest_main pthread)
add_test(NAME runTests COMMAND runTests)