const database = require("../config/database");

class Crud {
    constructor() {
        this.clear();
    }

    clear() {
        this.selectArr = [];
        this.whereArr = [];
        this.joinArr = [];
        this.groupBy = "";
        this.query = "";
        this.order = {
            field: "",
            order: "ASC",
        };
    }

    select(str) {
        this.selectArr.push(str);
        return this; // Agar bisa di-chain
    }

    where(key, operator = "=", value) {
        this.whereArr.push({ key, operator, value });
        return this; // Agar bisa di-chain
    }

    join(type, table, a, b) {
        this.joinArr.push({ table, type, a, b });
        return this; // Agar bisa di-chain
    }

    orderBy(field, order = "ASC") {
        this.order.field = field;
        this.order.order = order;
        return this; // Agar bisa di-chain
    }

    async get(table) {
        if (this.selectArr.length === 0) {
            this.selectArr.push('*');
        }

        this.query = `SELECT ${this.selectArr.join(", ")} FROM ${table}`;
        let whereQuery = "";
        let joinQuery = "";

        if (this.joinArr.length > 0) {
            this.joinArr.forEach(element => {
                joinQuery += ` ${element.type.toUpperCase()} JOIN ${element.table} ON ${element.a} = ${element.b}`;
            });
        }
        this.query += joinQuery;

        if (this.whereArr.length > 0) {
            whereQuery = " WHERE " + this.whereArr.map(w => `${w.key} ${w.operator} ?`).join(" AND ");
        }
        this.query += whereQuery;

        if (this.order.field) {
            this.query += ` ORDER BY ${this.order.field} ${this.order.order}`;
        }

        try {
            const [rows] = await database.promise().query(this.query, this.whereArr.map(w => w.value));
            this.clear(); // Reset state setelah operasi selesai
            return rows;
        } catch (err) {
            this.clear(); // Reset state jika terjadi error
            throw err;
        }
    }

    async insert(table, data) {
        try {
            const [result] = await database.promise().query("INSERT INTO ?? SET ?", [table, data]);
            this.clear();
            return result;
        } catch (err) {
            this.clear();
            throw err;
        }
    }

    async update(table, data) {
        this.query = `UPDATE ${table} SET ?`;
        let whereQuery = "";

        if (this.whereArr.length > 0) {
            whereQuery = " WHERE " + this.whereArr.map(w => `${w.key} ${w.operator} ?`).join(" AND ");
        }
        this.query += whereQuery;

        try {
            const [result] = await database.promise().query(this.query, [data, ...this.whereArr.map(w => w.value)]);
            this.clear();
            return result;
        } catch (err) {
            this.clear();
            throw err;
        }
    }

    async delete(table) {
        this.query = `DELETE FROM ${table}`;
        let whereQuery = "";

        if (this.whereArr.length > 0) {
            whereQuery = " WHERE " + this.whereArr.map(w => `${w.key} ${w.operator} ?`).join(" AND ");
        }
        this.query += whereQuery;

        try {
            const [result] = await database.promise().query(this.query, this.whereArr.map(w => w.value));
            this.clear();
            return result;
        } catch (err) {
            this.clear();
            throw err;
        }
    }

    async alter(table) {
        try {
            const [result] = await database.promise().query(`ALTER TABLE ${table} AUTO_INCREMENT=1`);
            this.clear();
            return result;
        } catch (err) {
            this.clear();
            throw err;
        }
    }

    viewQuery() {
        return this.query;
    }
}

module.exports = Crud;
