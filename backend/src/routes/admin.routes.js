import {registerAdmin, loginAdmin, deleteAdmin, getCurrentAdmin, logoutadmin, updateAdmin} from '../controllers/admin.controller.js'
import {Router} from 'express'
//
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router()

// Public routes
router.route('/register-admin').post(registerAdmin)
router.route('/login-admin').post(loginAdmin)

// Protected routes
router.route('/delete-admin/:id').post(verifyJWT, deleteAdmin)
router.route('/update/:id').put(verifyJWT, updateAdmin)
router.route('/me').get(verifyJWT, getCurrentAdmin);
router.route('/logout').post(verifyJWT, logoutadmin)

export default router