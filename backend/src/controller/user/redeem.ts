import {
    getUserRedeem,
    putUserRedeem,
    deleteUserRedeem
} from '../../services/user/redeem.js'
import type { Response, Request } from 'express'

export async function getUserRedeemController(req: Request, res: Response){
    
    try {
        const studentId = Number(req.user?.student_id);

        if(!Number.isFinite(studentId) || studentId <= 0){

            return res.status(401).json({message:"invalid Token Payload"})
        }

        const RedeemData = await getUserRedeem;
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
    
}


export async function deleteUserRedeemController(req: Request, res: Response){

    
}