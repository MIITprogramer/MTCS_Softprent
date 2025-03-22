const crud = require('../helpers/crud')
const crypter = require('../helpers/crypter')

module.exports = {
    getTools: async (req, res) => {
        const db = new crud
        const tools = await db.join('left', 't_rank', 't_rank.rankId', 't_tools.rankId').join('left', 't_tooltype', 't_tooltype.typeId', 't_tools.typeId').get('t_tools')
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
            const { toolName, toolId } = data

            const duplicate = await db.where('toolName', '=', toolName).where('toolId', '!=', toolId).where('disposed', '=', 0).get('t_tools')

            if (duplicate.length > 0) {
                throw {
                    title: "Duplicate Tool Name",
                    text: "The given tool name is already in use, please use another name!",
                    icon: "error",
                    timer: 3000,
                }
            }

            await db.where('toolId', '=', toolId).update('t_tools', data)
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
    }
}