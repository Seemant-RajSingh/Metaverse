import express from "express"
import { router } from "./routes/v1/index"
import client from "@repo/db/client"

const app = express();

// prefix router
app.use("/api/v1", router)

app.listen(process.env.PORT || 3000, () => {
    console.log("server started on port: ", process.env.PORT || "3000");
})
