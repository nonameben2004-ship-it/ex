import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../prisma/prismaClient.js'
import tokenService from './tokenService.js'
import mailService from './mailService.js'

class AuthService {
    async register(email, password) {
        const candidate = await prisma.user.findUnique({where: {email}})
        if (candidate) {
            throw new Error(`User with email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashPassword
            }
        })
        const activationLink = `${process.env.API_URL}/api/auth/activate/${user.id}`
        mailService.sendActivationMail(email, activationLink).catch(console.error)

        const payload = {id: user.id, email: user.email, role: user.role}
        const tokens = tokenService.generateTokens(payload)

        await tokenService.saveToken(user.id, tokens.refreshToken)

        return {
            ...tokens,
            user: payload
        }
    }
    async login(email, password) {
        const user = await prisma.user.findUnique({where: {email}})
        if (!user) {
            throw new Error('User with the folowing data does not exist');
        }
        const isPassEquals = await bcrypt.compare(password, user.passwordHash)
        if (!isPassEquals) {
            throw new Error('User with the folowing data does not exist');
        }
        const payload = {id: user.id, email: user.email, role: user.role}
        const tokens = tokenService.generateTokens(payload)
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return {...tokens, user: payload}
    }
    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken)
        return token
    }
}
const authService = new AuthService()
export default authService