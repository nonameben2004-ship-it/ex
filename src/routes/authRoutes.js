import { Router } from "express";
import { body } from "express-validator";
import {register, login, logout} from '../controllers/authController.js'
import { handleValidationErrors } from "../middlewares/validationMiddleware.js";

const router = new Router()

router.post('/register',
    [
        body('email', 'Неверный формат почты').isEmail(),
        body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
        handleValidationErrors // проверяем ошибки перед тем, как отдать в контроллер
    ],
     register)
router.post('/login', login)
router.post('/logout', logout)

export default router