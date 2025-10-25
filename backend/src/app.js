import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "./utils/orderScheduler.js"
import cycleTimesRoutes from "./routes/cycleTimes.routes.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/admin.routes.js'
import materialRecievedRouter from './routes/materialRecieved.routes.js'
import materialIssuedRouter from './routes/materialIssued.routes.js'
import inventoryRouter from './routes/Inventory.routes.js'
import orderRouter from './routes/order.routes.js'
import reportRouter from './routes/report.routes.js'
import diecastingRouter from './routes/diecasting.routes.js'
import pendingInventoryRouter from './routes/pendingInventory.routes.js'
import pendingInventorySuppliedRouter from './routes/pendingInventorySupplied.routes.js'
import rotorOrderRouter from './routes/rotorOder.routes.js'
import materialSuppliedRouter from './routes/materialSupplied.routes.js'
import suppliedInventoryRouter  from "./routes/suppliedInventory.routes.js"
import consumablesInventoryRouter from "./routes/consumableInventory.routes.js"
import materialIssuedSuppliedRouter from "./routes/materialIssuedSupplied.routes.js"


// Routes declaration : USER
app.use("/api/user", userRouter);

// Routes declaration : Admin
app.use("/api/admin", adminRouter);

// Routes : Material received
app.use("/api/material-recieved", materialRecievedRouter);

// Routes : Material Issued
app.use("/api/material-issued-purchased", materialIssuedRouter);

app.use("/api/material-issued-supplied", materialIssuedSuppliedRouter)

// Routes : Inventory
app.use("/api/inventory", inventoryRouter);

// Routes : Order
app.use("/api/order", orderRouter);

// Routes : report
app.use("/api/reports", reportRouter);

// Routes : diecasting
app.use("/api/diecasting", diecastingRouter);

app.use("/api/pendingInventory",pendingInventoryRouter)

app.use("/api/routerOrder", rotorOrderRouter)

app.use("/api/pendingInventorySupplied",pendingInventorySuppliedRouter)

app.use("/api/supplied-inventory",suppliedInventoryRouter)

app.use("/api/material-supplied", materialSuppliedRouter);

app.use("/api/consumables-inventory", consumablesInventoryRouter);

app.use('/api/cycle-times', cycleTimesRoutes);

app.use(
  cors({
    origin: "http://192.168.0.104:5173", // your frontend domain
    credentials: true, // allow sending cookies
  })
);


export { app }