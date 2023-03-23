import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const hashPassword = (password) => {
    return bcrypt.hash(password,5)
}
export const comparePassword = (password, hash) => {
    return bcrypt.compare(password,hash)
}

export const createToken = (user) => {
    const token = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET
    )
    return token
}

export const checkToken = (req,res,next) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        res.status(404)
        res.json({msg: 'Unauthorized'})
        return
    }
    const [,token] = bearer.split(' ')
    if(!token) {
        res.status(404)
        res.json({msg: 'Not valid format'})
        return
    }
    try {
        const user = jwt.verify(token,process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        console.log('eror',error)
        res.status(404)
        res.json({msg: 'Invalid token'})
        return
    }

}