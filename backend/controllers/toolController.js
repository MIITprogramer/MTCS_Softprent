const crud = require('../helpers/crud')
const crypter = require('../helpers/crypter')
const path = require("path"); // Untuk membangun path file secara aman
const fs = require('fs');

module.exports = {
    getTools: async (req, res) => {
        try {
            const db = new crud();
            let tools = await db
                .join("left", "t_rank", "t_rank.rankId", "t_tools.rankId")
                .join("left", "t_tooltype", "t_tooltype.typeId", "t_tools.typeId")
                .get("t_tools");

            tools = await Promise.all(
                tools.map(async (tool) => {
                    const dbInstance = new crud();
                    const data = await dbInstance
                        .where("toolId", "=", Number(tool.toolId))
                        .where("dataValue", "is not", null)
                        .get("tooldata");

                    console.log(dbInstance.viewLastQuery()); // Debugging

                    // Path ke file gambar
                    const filePath = path.join(
                        __dirname,
                        "../dist/uploads/checkimage/",
                        `${tool.toolId}.png`
                    );

                    let fileBase64 = "";
                    if (fs.existsSync(filePath)) {
                        const fileBuffer = fs.readFileSync(filePath);
                        fileBase64 = `data:image/png;base64,${fileBuffer.toString("base64")}`;
                    }

                    return {
                        ...tool,
                        data,
                        file: fileBase64, // Tambahkan gambar dalam format base64
                    };
                })
            );

            return res.status(200).json(tools);
        } catch (error) {
            console.error("Error fetching tools:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
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

            const insert = await db.insert('t_tools', data)
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send("No files were uploaded.");
            }

            const uploadedFile = req.files.file;
            const filePath = path.join(__dirname, '../dist/uploads/checkimage/', `${insert.insertId}.png`);
            uploadedFile.mv(filePath, function (err) {
                if (err) {
                    throw {
                        title: "Upload Error",
                        text: "the file is not uploaded, please try again from tools edit menu!",
                        icon: "error",
                        timer: 3000,
                    }
                }
                return res.status(200).json({ message: 'success' })
            });

        } catch (error) {

            console.log(error)
            return res.status(404).json(error)
        }
    },
    reqImage: async (req, res) => {
        try {
            const { toolId } = req.body; // Ambil toolId dari request
            const filePath = path.join(__dirname, '../dist/uploads/checkimage/', `${toolId}.png`);

            // Periksa apakah file ada
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    message: "File not found",
                    path: filePath
                });
            }

            // Kirim file ke klien
            res.sendFile(filePath);
        } catch (error) {
            console.error("Error sending file:", error);
            res.status(500).json({
                message: "Internal Server Error"
            });
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

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send("No files were uploaded.");
            }

            const uploadedFile = req.files.file;
            const filePath = path.join(__dirname, '../dist/uploads/checkimage/', `${toolId}.png`);
            uploadedFile.mv(filePath, function (err) {
                if (err) {
                    throw {
                        title: "Upload Error",
                        text: "the file is not uploaded, please try again from tools edit menu!",
                        icon: "error",
                        timer: 3000,
                    }
                }
                return res.status(200).json({ message: 'success' })
            });

        } catch (error) {

            console.log(error)
            return res.status(404).json(error)
        }
    },

    deleteTool: async (req, res) => {
        try {
            const db = new crud();
            await db.where('toolId', '=', req.body.toolId).delete('t_tools');

            // Path file yang akan dihapus
            const filePath = path.join(__dirname, '../dist/uploads/checkimage/', `${req.body.toolId}.png`);

            // Periksa apakah file ada sebelum dihapus
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Gagal menghapus file:", err);
                        return res.status(500).json({ message: 'Gagal menghapus file' });
                    }
                    console.log("File berhasil dihapus:", filePath);
                });
            } else {
                console.log("File tidak ditemukan:", filePath);
            }

            return res.status(200).json({ message: 'Success' });
        } catch (error) {
            console.error("Error saat menghapus:", error);
            return res.status(500).json({ message: 'Terjadi kesalahan' });
        }
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
    },
    dailyCheckInit: async (req, res) => {
        try {
            const db = new crud
            const { toolId, sessionId, toolName, registerNumber } = req.body
            const decrypted = crypter.decryptObject(sessionId)
            const { userId, userName } = decrypted
            let pointChecks = await db.where('toolId', '=', toolId).get('t_pointcheck')
            if (pointChecks.length < 1) {
                throw {
                    title: "Empty point check",
                    text: `No point check found for ${toolName} - ${registerNumber}! Please contact admistartor to setup the check points!`,
                    icon: "error",
                    timer: 5000
                }
            }

            pointChecks = await Promise.all(pointChecks.map(async pc => {
                const dbInstance = new crud
                const methods = await dbInstance.where('pointCheckId', '=', pc.checkId).get('t_checkmethod')
                if (methods.length < 1) {
                    throw {
                        title: "Empty Check Method",
                        text: `No check methods found for ${toolName} - ${registerNumber} - ${pc.pointString}! Please contact admistartor to setup the check methods!`,
                        icon: "error",
                        timer: 5000
                    }
                }

                pc.methods = methods
                return pc
            }))
            return res.status(200).json({
                pointChecks, checker: { userId, userName }
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    }
}