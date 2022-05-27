import CardProfile from "../models/cardProfile.js";
import { getResponse, buildErrorResponse } from "../util/responseObject.js";
import Response from "../util/reponse.code.js";
export async function createCard(req, res) {

    try {
        
        let data = req.body;
        let userId = req.params.userId;
        let { name, designation, company} = req.body;
        
        if (!name){
           return  Response.ERROR(res,'Bad request',"Please send name in payload");
        }
        if (!designation) {
            return Response.ERROR(res,'Bad request','Please send designation in the payload')
        }
        if (!company) {
            return Response.ERROR(res,'Bad request','Please send company in the payload')
        }
        console.log("req",req.body)
        let cardData = new CardProfile({
            ...data,
            userId: userId
        });

        let result = await cardData.save();

        console.log(result);
         return Response.CREATED(res,result,'Card created successfully');

    }catch (error) {

        console.log(error)
        return Response.SERVERERROR(res,error,"Internal server error");
    }
}

export async function getAllCards (req, res) {

    try {
      let userId = req.params.userId;

      let cards = await CardProfile.find({userId:userId});
      if (cards.length) {
        
        return Response.OK(res,cards,'Cards fetched successfully');
        
      } else {
        
        return Response.NOTAVAILABLE(res,cards,'Cards are not available');

      }
    } catch (error) {

        console.log(error)
        return Response.SERVERERROR(res,error,"Internal server error");
    
    }
}

export async function updateCardProfile( req, res) {
    try {
       let cardId = req.params.cardId;
       let data = req.body;
     
       if (Object.keys(data).length == 0) {
           return Response.ERROR(res,{error:'Payload is empty'},'Please send payload in request object');
       }
        let result = await CardProfile.findByIdAndUpdate ({_id: cardId},{...data});
        
        if (result){
            return Response.OK(res,data,'Card updated successfully')
            
        }else {
            return Response.SERVERERROR(res,{error:' Internal server error'},'Card not updated, Please check cardId or try after some time')
        }
      

    } catch (error) {
        console.log(error)
        return Response.SERVERERROR(res,error)
    }
}

export async function getCardById(req, res ) {
    try {
     let cardId = req.params.cardId;
     let cardData = await CardProfile.findById({_id: cardId})
     
    if (cardData) {

        return Response.OK(res,cardData,'Card fetched successfully'); 
    
    } else {
        
        return Response.NOTAVAILABLE(res,{},'Card is not available');
    
    }
    } catch (error) {

        console.log(error)
        return Response.SERVERERROR(res,error)
    
    }
}