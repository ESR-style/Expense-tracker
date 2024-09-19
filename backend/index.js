import express from 'express';
import Pool from 'pg-pool';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Expenses',
    password: '945830',
    port: 5432,
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { description, amount, date , category } = req.body;

        const result = await pool.query("SELECT COUNT(*) FROM expenses");
        const count = parseInt(result.rows[0].count, 10);

        const id = count + 1;

        const newExpense = await pool.query(
            "INSERT INTO expenses (id, description, amount, date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id, description, amount, date, category]
        );

        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/expenses", async (req, res) => {
    try {
        const allExpenses = await pool.query("SELECT * FROM expenses");
        res.json(allExpenses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM expenses WHERE id = $1", [id]);

        await pool.query(`
            WITH updated AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_id
                FROM expenses
            )
            UPDATE expenses
            SET id = updated.new_id
            FROM updated
            WHERE expenses.id = updated.id;
        `);

        res.json({ message: 'Expense deleted and IDs renumbered successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
