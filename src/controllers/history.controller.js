import userWatchhistoryModel from "../models/userWatchhistory.model.js";



async function addHistory(req,res) {
     const {mediaId, mediaType} = req.body;

     const userId = req.user.id;

     await userWatchhistoryModel.create({
        tmdb_id:mediaId,
        media_type:mediaType,
        user:userId,
     })

        res.status(201).json({
            success:true,
            message:"Added to watch history"
        })

}

async function getHistory(req,res) {
    const userId = req.user.id;

    const history = await userWatchhistoryModel.find({user:userId}).sort({createdAt:-1});

    res.status(200).json({
        success:true,
        history
    })
}

async function deleteHistoryItem(req,res) {
    const { id } = req.params;
    const userId = req.user.id;
    
    await userWatchhistoryModel.findOneAndDelete({
        tmdb_id: id,
        user: userId
    });

    res.json({ message: "History item deleted" });
}

async function clearAllHistory(req,res) {
    const userId = req.user.id;
    await userWatchhistoryModel.deleteMany({ user: userId });
    res.json({ message: "All history cleared" });
}

export {addHistory, getHistory, deleteHistoryItem, clearAllHistory};