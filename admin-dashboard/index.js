import express from 'express';
const app = express()
import cookieparser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import User from './modules/user-model.js';
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import cors from "cors"
import MaterialRecievedModel from './modules/MaterialRModel.js';
import MaterialIssuedModel from './modules/material-Issued-model.js'
import Diecasting from './modules/dieCasting-model.js';
import Admin from './modules/admin-model.js';
import RejectionModel from './modules/rejection-model.js';
import PurchaseOrder from './modules/purchase-order-model.js';

dotenv.config()



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

app.get("/",(req,res)=>{

})


//Register the admin user
app.post("/register-admin", async (req, res) => {
    
    const jobType = 'admin'
    const { userName,phoneNumber,email,password} = req.body;
    
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(password, salt);
    // console.log(req.body)
    try{
        const user = await Admin.create({
                userName,
                phoneNumber,
                // password: hash,
                password,
                email,
                jobType,  
            });
        // let token = jwt.sign({phoneNumber},"dynaquip");
        // // console.log(token);
        // res.cookie('token',token)
        res.status(201).json({ message: "Admin registered successfully!", user });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Login the admin user
app.post("/login-admin", async (req, res) => {
    try{
        const { phoneNumber,password} = req.body;
        const user = await Admin.findOne ({phoneNumber});
        
        if(user){
            if(user.password === password)
            {
                res.json("Success")
            }
            else{
                res.json("Password is incorrect")
            }
        }
        else{
            res.json("No user found")
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json("Server error");
    }

    
    // bcrypt.compare(password, user.password, function(err, result) {
    //     // result == true
    //     if(result === true){
    //         let token = jwt.sign({phoneNumber},"dynaquip");
    //         res.cookie('token',token);
    //         // res.redirect("http://localhost:5173/")
    //     }
    // });
});

//Log out the admin user
app.post("/logout-admin", async (req, res) => {
    res.cookie('token',"");
    res.redirect("http://localhost:5173/")
});



//to register worker
// app.get("/register-user",async (req,res)=>{
//     try {
//         const {data} = await User.find()
//         res.render("register-user")
//     } catch (error) {
//         res.status(500).json({error: error.message})
//     }
// })


app.post("/register-user", async (req, res) => {
    
        const { userName,phoneNumber, password, jobType} = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // console.log(jobType)
    try{
    // console.log(jobType)
    const user = await User.create({
        userName,
        phoneNumber,
        password: hash,
        jobType,  
    });
    res.status(201).json({ message: "User registered successfully!", user });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//to displlay worker information 

app.get("/allWorkers",async (req,res)=>{
        const workers = await User.find({});
        res.status(200).json(workers);

})

app.get("/allWorkers/:id",async (req,res)=>{
    const workers = await User.findOne({_id: req.params.id})
    res.status(200).json(workers)

})


// to delete the worker 
app.delete("/delete/:id", async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

//Edit the worker data
app.put('/workers/:id/edit',async (req,res)=>{
    try {
        const { userName, phoneNumber, password, jobType } = req.body;
        // console.log(userName);
        

        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { userName, phoneNumber, password ,jobType},
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


//*** RECIEVED MATERIAL

//to get all inventory (Recieved)  details
app.get("/inventory/material-received", async (req,res) => {
    const MaterialRecieved = await MaterialRecievedModel.find({});
    let userIds = MaterialRecieved.map((obj) => obj.postedBy);

    const users = await User.find({ _id: { $in: userIds } });

    const userMap = new Map(
      users.map((user) => [user._id.toString(), user.userName])
    );

    const enrichedMaterialReceived = MaterialRecieved.map((obj) => ({
      ...obj.toObject(),
      userName: userMap.get(obj.postedBy.toString()) || "Unknown",
    }));

    res.status(200).json(enrichedMaterialReceived);
})

//to delete inventory (Recieved)  details
app.delete("/material-received/delete/:id", async (req, res) => {
    console.log("hi");
    try {
        console.log(req.params.id);
        await MaterialRecievedModel.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

//to send data at frontend for edit (original value)
app.get("/inventory/material-received/:id",async (req,res)=>{
    const info = await MaterialRecievedModel.findOne({_id: req.params.id})
    res.status(200).json(info)
})

//to edit the material recieved
app.put('/material-received/edit/:id',async (req,res)=>{
    try {
        const {  materialGrade,
                supplierName,
                purchaseOrderNumber,
                challanNumber,
                materialLotNumber,
                materialQuantity,
                materialQuantityKG,
                locationAllocated,
                weightDiscrepancy,
                postedBy} = req.body;

        const material = await MaterialRecievedModel.findOneAndUpdate(
            { _id: req.params.id },
            { materialGrade,
                supplierName,
                purchaseOrderNumber,
                challanNumber,
                materialLotNumber,
                materialQuantity,
                materialQuantityKG,
                locationAllocated,
                weightDiscrepancy,
                postedBy},
            { new: true } 
        );

        if (!material) {
            return res.status(404).json({ error: "not found" });
        }

        res.json(material);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


//*** MATERIAL ISSUED 



//test to get all inventory (Issued)  details
app.get("/inventory/material-issued", async (req,res) => {
        const materialIssued = await MaterialIssuedModel.find({});
        let userIds = materialIssued.map(obj => obj.postedBy);

        const users = await User.find({ _id: { $in: userIds } });

        const userMap = new Map(users.map(user => [user._id.toString(), user.userName]));

        const enrichedMaterialIssued = materialIssued.map(obj => ({
            ...obj.toObject(),
            userName: userMap.get(obj.postedBy.toString()) || 'Unknown'
        }));

        res.status(200).json(enrichedMaterialIssued);

})

//to delete inventory (Issued)  details
app.delete("/material-issued/delete/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        await MaterialIssuedModel.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

//to send data at frontend for edit (original value)
app.get("/inventory/material-issued/:id",async (req,res)=>{
    const info = await MaterialIssuedModel.findOne({_id: req.params.id})
    res.status(200).json(info)
})

//to edit material issued
app.put('/material-issued/edit/:id',async (req,res)=>{
    try {
        const { materialGrade,
                locationOfMaterial,
                shiftOfProduction,
                materialQuantity,
                materialQuantityKG,
                postedBy} = req.body;

        const material_issued = await MaterialIssuedModel.findOneAndUpdate(
            { _id: req.params.id },
            {   materialGrade,
                locationOfMaterial,
                shiftOfProduction,
                materialQuantity,
                materialQuantityKG,
                postedBy},
            { new: true } 
        );

        if (!material_issued) {
            return res.status(404).json({ error: "not found" });
        }

        res.json(material_issued);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


//*** DIE CASTING    

//to get all diecasting details
app.get("/die-castings/display", async (req, res) => {
    try {
        const dieCastings = await Diecasting.find({});
        let userIds = dieCastings.map((obj) => obj.postedBy);

        const users = await User.find({ _id: { $in: userIds } });

        const userMap = new Map(
            users.map((user) => [user._id.toString(), user.userName])
        );

        const enrichedDieCastings = dieCastings.map((obj) => ({
            ...obj.toObject(),
            userName: userMap.get(obj.postedBy?.toString()) || "Unknown",
        }));

        res.status(200).json(enrichedDieCastings);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving die castings", error });
    }
});

//to delete dicasting details
app.delete("/die-casting/delete/:id", async (req, res) => {
    try {
        await Diecasting.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

//to send data at frontend for edit (original value)
app.get("/die-casting/edit/:id",async (req,res)=>{
    const info = await Diecasting.findOne({_id: req.params.id})
    res.status(200).json(info)
})

//to edit diecasting
app.put('/die-casting/edit/:id',async (req,res)=>{
    try {
        const { castingName,
                quantityProduced,
                quantityProducedKG,
                shiftOfProduction,
                machineNumber,
                furnaceTemperature,
                dyeTemperature,
                quantityRejected,
                rejectionCause,
                timeToFix,
                machineDefectCause,
                postedBy} = req.body;

        const dieCasting = await Diecasting.findOneAndUpdate(
            { _id: req.params.id },
            {   castingName,
                quantityProduced,
                quantityProducedKG,
                shiftOfProduction,
                machineNumber,
                furnaceTemperature,
                dyeTemperature,
                quantityRejected,
                rejectionCause,
                timeToFix,
                machineDefectCause,
                postedBy},
            { new: true } 
        );

        if (!dieCasting) {
            return res.status(404).json({ error: "not found" });
        }

        res.json(dieCasting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//to get all rejection data
app.get("/rejections", async (req, res) => {
    try {
        const rejections = await RejectionModel.find({});        
        res.status(200).json(rejections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rejections", error });
    }
});

//purchase order
//post purchse order 
app.post("/purchase-order/create", async (req, res) => {
    try {
      const { partNumber, partName, poNumber, targetQty, dueDate, assignedTo } = req.body;
  
      // Create the purchase order in DB
      const newOrder = await PurchaseOrder.create({
        partNumber,
        partName,
        poNumber,
        targetQty,
        dueDate,
        assignedTo,
      });
  
      res.status(201).json({ message: "Purchase Order created successfully!", order: newOrder });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//to get purchase order
app.get("/purchase-order", async (req, res) => {
    try {
      const orders = await PurchaseOrder.find().populate("assignedTo", "userName");
  
      // Format dueDate to remove time
      const formattedOrders = orders.map(order => ({
        ...order.toObject(),
        dueDate: order.dueDate.toISOString().split("T")[0], // Extracts only the date part (YYYY-MM-DD)
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


app.listen(3005,()=>{
    console.log("started");
})