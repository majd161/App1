
const express = require("express")
const mysql = require("mysql2")

const app = require();
app.use(express.json());//fix json middleware

//كل جدول اله كويري بقدر اعمل ع كل جدول 4 عمليات put ,delete , patch..

//configure mysql connection

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345Majd#",
    database: "library"
})
connection.connect((err) => {
    if (err) {
        constlog("error connection to msSQL:", err)
    }
})

// add a new book
app.post("/books", (req, res) => {

    const { id, name, title } = req.body;

    const query = "insert into books (id ,name ,title) values (?,?,?)"
    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "error adding new book", details: err.message })
        }
        res.status(201).json({ message: "book has been added" })
    })
})
// get all books 
app.get("/books", (req, res) => {
    const query = " select *from  books"
    connection.query(query, (err, reults) => {

        if (err) {
            return res.status(500).json({
                error: "error retrieving the books ",
                details: err.message

            })

            res.json(reults)
        }
    })

})

//get book by id
app.get("/books/:id", (req, res) => {
    const query = "select * from books id = ? "
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "error retrieving the book by this id ",
                details: err.message

            })
        }

        if (results.lenght === 0) {
            return res.status(404).json({
                Message: "book by this id is not found"
            })
        }
        res.josn(results[0])
    })
})

//uppdate book by id 

app.put("books/:id", (req, res) => {
    const { name, title } = req.body
    const query = "update books set name =? title=? where id =?"
    connection.query(query, [name, title, req.params.id], (err, reusults) => {
        if (err) {
            return res.status(500).json({
                error: "error uppdating the book by this id ",
                details: err.message
            })
        }
    })


    if (results.affectedRows === 0) {
        return res.status(404).josn({
            Message: "Book not found to update"
        }
        )
        res.status(200).json({
            Message: "Book has been updated "
        })
    }
})


//delete book by id 
app.delete("/books/:id", (req, res) => {
    const query = "delete from books where id =?"
    connection.query(query, [req.params.id], (err, reusults) => {

        if (err) {
            return res.status(500).json({
                error: "error deleting the book by this id ",
                details: err.message
            })
        }
    })


    if (results.affectedRows === 0) {
        return res.status(404).josn({
            Message: "Book not found can't delete"
        }
        )
        res.status(200).json({
            Message: "Book has been delete"
        })
    }
})

//uppdate the translation by book id 
app.patch("/books/:id/translation", (req, res) => {
    const { lanaguage } = req.body
    if (!lanaguage || typeof lanaguage !== "string") {
        return res.status(400).json({ error: "sorry invalid or missing lanaguage" })
    }

    const query = " update books set title = CONCAT(title, '-(',?,')') where id = ?"



    connection.query(query, [lanaguage, req.params.id], (err, reusults) => {

        if (err) {
            return res.status(500).json({
                error: "error updating translation",
                details: err.message
            })
        }
    })


    if (results.affectedRows === 0) {
        return res.status(404).josn({
            Message: "Book not found  "
        }
        )
        res.status(200).json({
            Message: "Book translation has been updated "
        })
    }



})

// start the server 

const port = 3001
app.listen(port, () => {
    console.log("server has been started on " + 'http://localhost/${port}')
})




//task


app.get("/bookshop/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = "select * from bookshop where shop_id = ?";
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "bookshop not found  " });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "  server error " });
    }
});




app.patch("/bookshop/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, email } = req.body;

        const query = "UPDATE bookshop SET name = ?, city = ?, email = ? WHERE shop_id = ?";
        const [result] = await pool.query(query, [name, city, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }

        res.json({ message: "Update successful" });
    } catch (error) {
        res.status(500).json({ message: "Error updating bookshop", error: error.message });
    }
});


app.delete("/bookshop/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const query = "delete from bookshop where shop_id = ?";
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: " bookshop not found " });
        }

        res.json({ message: "  delete successful" });
    } catch (error) {
        res.status(500).json({ message: "error " });
    }
});



app.put("/bookshop/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, email } = req.body;

        const query = "UPDATE bookshop SET name = ?, city = ?, email = ? WHERE shop_id = ?";
        const [result] = await pool.query(query, [name, city, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }

        res.json({ message: "Update successful" });
    } catch (error) {
        res.status(500).json({ message: "Error updating bookshop", error: error.message });
    }
});


app.post("/bookshop", async (req, res) => {
    try {
        const { name, city, email } = req.body;

        const query = "INSERT INTO bookshop (name, city, email) VALUES (?, ?, ?)";
        const [result] = await pool.query(query, [name, city, email]);

        res.status(201).json({ message: "Add successful", shop_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error adding bookshop", error: error.message });
    }
});



// start the server 

const port = 3001
app.listen(port, () => {
    console.log("server has been started on " + 'http://localhost/${port}')
})

