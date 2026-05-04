import {
    getUserRedeem,
    putUserRedeem,
    deleteUserRedeem,
    patchUserRedeemStatus,
    REDEEM_STATUSES,
    type RedeemStatus
} from '../../services/user/redeem.js'
import type { Response, Request } from 'express'

function getStudentId(req: Request) {
    const studentId = Number(req.user?.student_id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
        return null;
    }

    return studentId;
}

function normalizeRedeemStatus(value: unknown): RedeemStatus | null {
    if (typeof value !== "string") {
        return null;
    }

    const normalized = value.trim().toUpperCase();

    if (REDEEM_STATUSES.includes(normalized as RedeemStatus)) {
        return normalized as RedeemStatus;
    }

    return null;
}

export async function getUserRedeemController(req: Request, res: Response){
    
    try {
        const studentId = getStudentId(req);

        if(studentId === null){
            return res.status(401).json({message:"Invalid token payload"})
        }

        const RedeemData = await getUserRedeem(studentId);
        return res.json(RedeemData)


    }   catch(error) {
            console.log("Error Redeem data : ", error) 
            


        if (error instanceof Error && error.message === "Redeem not found"){
            return res.status(404).json({message : "Redeem not found"})
        }
        
    }

    return res.status(500).json({message : "Failed to fetch redeeem"})
}


export async function putUserRedeemController(req: Request, res: Response){
    try {
        const studentId = getStudentId(req);

        if(studentId === null){
            return res.status(401).json({message:"Invalid token payload"})
        }

        const productId = Number(req.body?.productId ?? req.body?.Product_ID);

        if(!Number.isFinite(productId) || productId <= 0){
            return res.status(400).json({message:"Invalid product id"})
        }

        const redeemData = await putUserRedeem(studentId, productId);
        return res.status(201).json(redeemData);

    } catch(error) {
        console.error("Error creating redeem data:", error)

        if (error instanceof Error && error.message === "Product not found"){
            return res.status(404).json({message : "Product not found"})
        }

        return res.status(500).json({message : "Failed to create redeem"})
    }
}


export async function deleteUserRedeemController(req: Request, res: Response){
    try {
        const studentId = getStudentId(req);

        if(studentId === null){
            return res.status(401).json({message:"Invalid token payload"})
        }

        const redeemId = Number(req.params.id);

        if(!Number.isFinite(redeemId) || redeemId <= 0){
            return res.status(400).json({message:"Invalid redeem id"})
        }

        const deletedRedeem = await deleteUserRedeem(studentId, redeemId);
        return res.json(deletedRedeem);

    } catch(error) {
        console.error("Error deleting redeem data:", error)

        if (error instanceof Error && error.message === "Redeem not found"){
            return res.status(404).json({message : "Redeem not found"})
        }

        return res.status(500).json({message : "Failed to delete redeem"})
    }

}

export async function patchUserRedeemStatusController(req: Request, res: Response){
    try {
        const studentId = getStudentId(req);

        if(studentId === null){
            return res.status(401).json({message:"Invalid token payload"})
        }

        const redeemId = Number(req.params.id);

        if(!Number.isFinite(redeemId) || redeemId <= 0){
            return res.status(400).json({message:"Invalid redeem id"})
        }

        const status = normalizeRedeemStatus(req.body?.status ?? req.body?.Redeem_Status);

        if(status === null){
            return res.status(400).json({
                message:"Invalid redeem status",
                allowedStatuses: REDEEM_STATUSES
            })
        }

        const updatedRedeem = await patchUserRedeemStatus(studentId, redeemId, status);
        return res.json(updatedRedeem);

    } catch(error) {
        console.error("Error updating redeem status:", error)

        if (error instanceof Error && error.message === "Redeem not found"){
            return res.status(404).json({message : "Redeem not found"})
        }

        return res.status(500).json({message : "Failed to update redeem status"})
    }
}
