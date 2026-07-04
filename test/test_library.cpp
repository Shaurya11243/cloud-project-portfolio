#include"../src/library.h"
#include <gtest/gtest.h>

TEST(LibraryTest, AddBook) {
    Library library;
    library.addBook("The Great Gatsby");
    EXPECT_EQ(library.getBookCount(), 1);
}
    TEST(LibraryTest, RemoveBook) {
    Library library;
    library.addBook("The Great Gatsby");
    library.removeBook("The Great Gatsby");
    EXPECT_EQ(library.getBookCount(), 0);
}
    TEST(LibraryTest, ReturnBook) {
    Library library;
    EXPECT_FALSE(Library.borrowBook("The Great Gatsby")
    {
        Library library;
        EXPECT_FALSE(library.returnBook("The Great Gatsby"));
        EXPECT_TRUE(library.returnBook("The Great Gatsby"));  
              
    }