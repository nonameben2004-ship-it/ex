import authService from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const {email, password} = req.body
        const userData = await authService.register(email, password)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
            httpOnly: true,
            // secure: true // Раскомментировать в продакшене (HTTPS)
        });
        return res.status(200).json({
            accessToken: userData.accessToken,
            user: userData.user
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error})
    }
}
export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const userData = await authService.login(email, password)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
            httpOnly: true,
            // secure: true // Раскомментировать в продакшене (HTTPS)
        })
        return res.status(200).json({accessToken: userData.accessToken, user: userData.user})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error})
    }
}
export const logout = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        await authService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.status(200).json({message: 'Successfully logout'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error})
    }
}