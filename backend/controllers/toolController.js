const crud = require('../helpers/crud')
const crypter = require('../helpers/crypter')

module.exports = {
    getTools: async (req, res) => {
        const db = new crud
        let tools = await db.join('left', 't_rank', 't_rank.rankId', 't_tools.rankId').join('left', 't_tooltype', 't_tooltype.typeId', 't_tools.typeId').get('t_tools')

        tools = await Promise.all(tools.map(async (tool) => {
            const dbInstance = new crud(); // Buat instance baru agar where() tidak tercampur

            const data = await dbInstance.where('toolId', '=', Number(tool.toolId)).where('dataValue', 'is not', null).get('tooldata');

            console.log(dbInstance.viewLastQuery()); // Debugging

            tool.data = data;
            return tool;
        }));

        return res.status(200).json(tools)
    },
    addTool: async (req, res) => {

        try {
            const db = new crud
            const data = req.body
            const { registerNumber } = data

            const duplicate = await db.where('registerNumber', '=', registerNumber).where('disposed', '=', 0).get('t_tools')

            if (duplicate.length > 0) {
                throw {
                    title: "Duplicate Register Number",
                    text: "The given tool name is already in use, please use another name!",
                    icon: "error",
                    timer: 3000,
                }
            }

            await db.insert('t_tools', data)
            return res.status(200).json({ message: 'success' })

        } catch (error) {

            console.log(error)
            return res.status(404).json(error)
        }
    },

    editTool: async (req, res) => {

        try {
            const db = new crud
            const data = req.body
            const { toolName, toolId, rankId, registerNumber } = data

            const duplicate = await db.where('toolName', '=', toolName).where('toolId', '!=', toolId).where('disposed', '=', 0).get('t_tools')

            if (duplicate.length > 0) {
                throw {
                    title: "Duplicate Tool Name",
                    text: "The given tool name is already in use, please use another name!",
                    icon: "error",
                    timer: 3000,
                }
            }

            const update = await db.where('toolId', '=', toolId).update('t_tools', { toolName, toolId, rankId, registerNumber })

            return res.status(200).json({ message: 'success' })

        } catch (error) {

            console.log(error)
            return res.status(404).json(error)
        }
    },

    deleteTool: async (req, res) => {
        const db = new crud
        await db.where('toolId', '=', req.body.toolId).delete('t_tools')

        return res.status(200).json({ message: 'success' })
    },

    getData: async (req, res) => {
        try {
            const { toolId, collumns } = req.body;
            const col = Array.isArray(collumns) ? collumns : JSON.parse(collumns);
            const db = new crud();

            await db
                .where("toolId", "=", toolId)
                .where("dataValue", 'is', null) // Hapus yang tidak ada di col
                .delete("tooldata");

            // Insert jika belum ada
            await Promise.all(
                col.map(async (element) => {
                    try {
                        const int = Number(element);
                        const dupe = await db
                            .where("toolId", "=", toolId)
                            .where("columId", "=", int)
                            .get("tooldata");

                        if (dupe.length < 1) {
                            await db.insert("tooldata", { toolId, columId: int })

                        }
                    } catch (err) {
                        console.error("Error inserting data:", err);
                    }
                })
            );

            // Ambil data terbaru dengan JOIN
            const response = await db
                .where("toolId", "=", toolId)
                .join("left", "t_collumns", "t_collumns.collumnId", "tooldata.columId")
                .get("tooldata");

            return res.status(200).json(response);
        } catch (error) {
            console.error("Error in getData:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateData: async (req, res) => {
        const { dataId, dataValue } = req.body
        const db = new crud
        await db.where('dataId', '=', dataId).update('tooldata', { dataValue })
        return res.status(200).json({ message: 'success' })
    },
    getColumn: async (req, res) => {
        const db = new crud
        const column = await db.get('t_collumns')
        return res.status(200).json(column)
    }
}