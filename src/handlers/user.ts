import prisma from "../db"
import { comparePassword, createToken, hashPassword } from "../modules/auth"


export const createUser = async (req, res, next) => {
    try {
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: await hashPassword(req.body.password)
            }
        })
        const token = createToken(user)
        res.json({token}).status(200)
    } catch (error) {
        error.type = 'auth'
        next(error)
    }
    
}

export const login = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    })
    const isValid = await comparePassword(req.body.password, user.password)
    if(!isValid) {
        res.status(404)
        res.json({msg: "Invalid login"})
        return
    }
    const token = createToken(user)
    res.json({token})
}