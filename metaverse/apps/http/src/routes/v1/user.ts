import { Router } from "express" 
import { userMiddleware } from "../../middleware/user";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client"

export const userRouter = Router();

// UPDATE AVATAR ID ------------------------------
userRouter.post("/metadata", userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)       
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }
    try {
        await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })
        res.json({message: "Metadata updated"})
    } catch(e) {
        console.log("error")
        res.status(400).json({message: "Internal server error"})
    }
})

// GET AVATAR IDS -------------------------------------
userRouter.get("/metadata/bulk", async (req, res) => {  // sample req: GET /metadata/bulk?ids=[1,2,3]
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");   // userIds = ["1", "2", "3"]
    console.log(userIds)
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds // Filters users whose id is in the userIds array
            }
        }, select: {    // Retrieves only avatar and id fields
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})

// { sample response:
//     "avatars": [
//         { "userId": "1", "avatarId": "avatar1.png" },
//         { "userId": "2", "avatarId": "avatar2.png" },
//         { "userId": "3", "avatarId": null }
//     ]
// }
