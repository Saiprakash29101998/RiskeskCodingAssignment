const express = require("express");
const app = express();
app.use(express.json());

class Book{
    constructor(title, author, ISBN){
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
    };

    displayInfo(){
        return{
            title: this.title,
            author: this.author,
            ISBN: this.ISBN
        }
    }
}


class Ebook extends Book{
    constructor(title, author, ISBN, fileFormat){
        super(title, author, ISBN);
        this.fileFormat = fileFormat;
    };

    displayInfo(){
        return {
            title:this.title,
            author:this.author,
            ISBN:this.ISBN,
            fileFormat:this.fileFormat
        }
    }
}

class Library{
    constructor(){
        this.books = [];
    }

    addBook(book){
        this.books.push(book);        
    }

    displayBooks(){
        if (this.books.length === 0){
            return "No Books in the Library";
        }
        else{
            const booksList = this.books.map(eachBook => eachBook.displayInfo());
            return booksList;
        }
    }

    searchBooks(title){
        const resultBook = this.books.filter(eachBook => eachBook.title === title);
        return resultBook[0];
    }

    deleteBookByISBN(ISBN){
        const filteredBooks = this.books.filter(eachBook => eachBook.ISBN !== ISBN);
        this.books = filteredBooks;
    }

    
}

let library = new Library;

app.listen(3000, () => {
    console.log("Server Running at http://localhost:3000/")
})

//API 1 Add Book

app.post("/addBook", (request, response) => {
    try{
        const {title, author, ISBN, fileFormat} = request.body;
        if (fileFormat === undefined){
            const book = new Book(title, author, ISBN).displayInfo();
            library.addBook(book);
            response.send("Added Book Successfully");
        }
        else{
            const book = new Ebook(title, author, ISBN, fileFormat).displayInfo();
            library.addBook(book);
            response.send("Added Book Successfully");
        }
    }
    catch(error){
        response.status(400);
        response.send(error);
    }    
})


//API 2 Display All Books

app.post("/listBooks", (request, response) => {
    try{
        const responseBooks = library.displayBooks();
        response.send(responseBooks);
    }
    catch(error){
        response.status(400);
        response.send(error);
    }    
})
//API 3 Delete Book

app.delete("/deleteBook/:ISBN", (request, response) => {
    try{
        const {ISBN} = request.params;
        library.deleteBookByISBN(ISBN);
        response.send("Deleted Book Successfully");
    }
    catch(error){
        response.status(400);
        response.send(error);
    }
    
})

module.exports = app;