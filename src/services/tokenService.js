import jwt from 'jsonwebtoken'
import prisma from '../prisma/prismaClient.js'
import "dotenv/config";


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'})
        return {accessToken, refreshToken}
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await prisma.token.findFirst({where: {userId}})
        if (tokenData) {
            return await prisma.token.update({
                where: {id: tokenData.id},
                data: {refreshToken}
            })
        }
        const token = await prisma.token.create({data: {userId, refreshToken}})
        return token
    }
    async removeToken(refreshToken) {
        const tokenData = await prisma.token.delete({where: {refreshToken}})
        return tokenData
    }
}
const tokenService = new TokenService()
export default tokenService