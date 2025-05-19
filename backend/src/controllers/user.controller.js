import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {PreviousUser as Puser} from "../models/previousUser.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const registerUser = asyncHandler( async (req, res) => {
    
    const {userName,phoneNumber,jobType, password } = req.body
    console.log("phoneNo : ", phoneNumber);

    //checking if any field is empty
    if (
        [userName,phoneNumber,jobType, password].some((field) => { return field?.trim() === ""})
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //finding if userName or phoneNumber is already  in use
    const existedUser = await User.findOne({
        $or: [ { phoneNumber }]
    })

    //to check if user exists
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }   

    const user = await User.create({
        userName,
        phoneNumber,
        jobType,
        password,
    })

    //to check if user is created or not
    const createdUser = await User.findById(user._id).select(
        "-password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    if (!users) {
        throw new ApiError(404, "No users found");
    }
    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
})



// /user/delete/:id
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.find({_id:userId})
    console.log(userId)
    // Find user by ID
    const userToDelete = await User.findById(userId);
    console.log(userToDelete)
    if (!userToDelete) {
        throw new ApiError(404, "User does not exist");
    }

    const { userName, phoneNumber, jobType} = userToDelete;
    console.log(userToDelete.userName)
     // user to add in previous user
     const userToAdd = await Puser.create({
        userName,
        phoneNumber,
        jobType,
    })

    // Check if user already exists in Puser
    const existingUser = await Puser.findOne({ phoneNumber });
    if (!existingUser) {
        await Puser.create({ userName, phoneNumber, jobType});
    }

    // Verify user was added to Puser
    const createdUser = await Puser.findOne({ phoneNumber });
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while adding user to previous user model");
    }

    // Delete user from User model
    const { acknowledged, deletedCount } = await User.deleteOne({ _id: userId });
    if (!acknowledged || deletedCount === 0) {
        throw new ApiError(500, "Something went wrong while deleting user");
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Deleted Successfully")
    );
});

// GET /api/user/get-all/:id
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});


// PUT /api/user/:id/edit
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { userName, phoneNumber, jobType } = req.body;

    // Input validation
    if ([userName, phoneNumber, jobType].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update values
    user.userName = userName;
    user.phoneNumber = phoneNumber;
    user.jobType = jobType;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    );
});



export {
    registerUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
}