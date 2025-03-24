const crud = require('../helpers/crud')
const crypter = require('../helpers/crypter')
module.exports = {
    login: async (req, res) => {
        try {
            const { userId, userPassword } = req.body
            const hashed1 = crypter.encryptText(userPassword)
            console.log(hashed1)
            const db = new crud
            db.where('userId', '=', userId)
            const user = await db.get('t_user')
            if (user.length < 1) {
                throw {
                    title: "Unknown NIK",
                    text: "Please check your NIK and try again!",
                    icon: "error",
                    timer: 3000,
                }
            }

            const hashed = user[0].userPassword
            const dehashed = crypter.decryptText(hashed)
            if (userPassword != dehashed) {
                throw {
                    title: "Invalid Password",
                    text: "Please check your password and try again!",
                    icon: "error",
                    timer: 3000,
                }
            }

            const lastLogin = req['_startTime']
            const lastIP = req['_remoteAddress']

            await db.where('userId', '=', userId).update('t_user', { lastLogin, lastIP })
            const newUser = await db.where('userId', '=', userId).get('t_user')
            const response = crypter.encryptObject(newUser[0])
            return res.status(200).json(response)
        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    },
    addRole: async (req, res) => {
        try {
            const { roleName, dashboardPage } = req.body
            const db = new crud
            const duplicate = await db.where('roleName', '=', roleName).get('t_roles')
            if (duplicate.length > 0) {
                throw {
                    title: "Duplicate Role Name",
                    text: "The given role name is already in use, please use another name!",
                    icon: "error",
                    timer: 3000,
                }
            }

            await db.insert('t_roles', { roleName, dashboardPage })
            return res.status(200).json({ message: 'success' })

        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    },
    getRoles: async (req, res) => {
        const db = new crud
        const response = await db.get('t_roles')
        return res.status(200).json(response)
    },
    editRole: async (req, res) => {
        try {
            const db = new crud
            const { roleId, roleName, dashboardPage } = req.body
            const duplicate = await db.where('roleName', '=', roleName).where('roleId', '!=', roleId).get('t_roles')
            if (duplicate.length > 0) {
                throw {
                    title: "Duplicate Role Name",
                    text: "The given role name is already in use, please use another name!",
                    icon: "error",
                    timer: 3000,
                }
            }

            await db.where('roleId', '=', roleId).update('t_roles', { roleName, dashboardPage })
            return res.status(200).json({
                message: 'Success'
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    },
    deleteRole: async (req, res) => {
        const roleId = req.body.roleId
        const db = new crud
        await db.where('roleId', '=', roleId).delete('t_roles')
        return res.status(200).json({
            message: 'Success'
        })
    },
    addUser: async (req, res) => {
        try {
            const db = new crud
            let { userName, userId, userPassword, roleId } = req.body

            const user = await db.where('userId', '=', userId).get('t_user')
            if (user.length > 0) {
                throw {
                    title: "DUPLICATE NIK",
                    text: "The given NIK is already used by another user, please try again with a different NIK",
                    icon: "error",
                    timer: 5000,
                }
            }

            userPassword = crypter.encryptText(userPassword)
            await db.insert('t_user', { userName, userId, userPassword, roleId })
            return res.status(200).json({
                message: 'Success'
            })
        } catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    },
    getUser: async (req, res) => {
        const db = new crud
        db.join('left', 't_roles', 't_roles.roleId', 't_user.roleId')
        const response = await db.get('t_user')
        return res.status(200).json(response)
    },
    editUser: async (req, res) => {
        try {

            const db = new crud
            let { userName, userId, roleId, oldId } = req.body

            console.log(req.body)
            if (oldId !== userId) {
                const user = await db.where('userId', '=', userId).get('t_user')
                if (user.length > 0) {
                    throw {
                        title: "DUPLICATE NIK",
                        text: "The given NIK is already used by another user, please try again with a different NIK",
                        icon: "error",
                        timer: 5000,
                    }
                }
            }

            await db.where('userId', '=', oldId).update('t_user', { userName, userId, roleId })

            return res.status(200).json({
                message: 'Success'
            })
        } catch (error) {

            console.log(error)
            return res.status(404).json(error)
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.body.userId
        const db = new crud
        await db.where('userId', '=', userId).delete('t_user')
        return res.status(200).json({
            message: 'Success'
        })
    },
    changePass: async (req, res) => {
        let { userId, userPassword } = req.body
        const db = new crud
        userPassword = crypter.encryptText(userPassword)

        await db.where('userId', '=', userId).update('t_user', { userPassword })

        return res.status(200).json({
            message: 'Success'
        })
    },
    getHome: async (req, res) => {
        const db = new crud
        const { sessionId } = req.body
        const decrypted = crypter.decryptObject(sessionId)
        const roles = await db.where('roleId', '=', decrypted.roleId).get('t_roles')
        const home = roles[0].dashboardPage
        return res.status(200).json(home)
    },
    getMydata: async (req, res) => {
        const { sessionId } = req.body
        const decrypted = crypter.decryptObject(sessionId)
        const { userName, userId } = decrypted

        return res.status(200).json({ userName, userId })
    }
}
