#include "library.h"
#include <algorithm>

void Library::addBook(const std::string& book) {
    books.push_back(book);
}
{
    auto it = std::find(books.begin(), books.end(), book);
    if (it != books.end()) {
        books.erase(it);
        return true;
    }
    return false;
}
bool Library::returnBook(const std::string& book) {
    auto it = std::find(books.begin(), books.end(), book);
    if (it == books.end()) {
        books.push_back(book);
        return true;
    }
    return false;
}
bool Library::returnBook{const std::string& book} {
    books.push_back(book);
    return true;
}
int Library::getBookCount() const {
    return books.size();
}