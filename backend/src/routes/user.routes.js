import {registerUser,deleteUser,getAllUsers, getUserById, updateUser} from '../controllers/user.controller.js'
import {Router} from 'express'

const router = Router()
router.route('/get-all').get(getAllUsers)
router.route('/register-user').post(registerUser)
router.route('/delete-user/:id').post(deleteUser)
router.route('/get-all/:id').get(getUserById)
router.route('/update/:id').put(updateUser)

export default router