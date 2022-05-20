import CardProfile from "../models/cardProfile.js";
import { getResponse, buildErrorResponse } from "../util/responseObject.js";
export async function createCard(req, res) {

    try {
        
        let data = req.body;
        let userId = req.params.userId;
        
        
        let cardData = new CardProfile({
            ...data,
            userId: userId
        });

        let result = await cardData.save();

        console.log(result);
        res.status(201).json(await getResponse(result,201,'Data save successfully'));

    }catch (error) {
        console.log(error)
        res.status(500).send({
            "message": "Internal server error",
            "status": 500,
            "error": error
        })
    }
}

export async function getAllCards (req, res) {

    try {
      let userId = req.params.userId;

      let cards = await CardProfile.find({userId:userId});
      if (cards.length) {

        res.status(200).json(await getResponse(cards,200,'Data found'));

      } else {
       
        res.status(202).json(await getResponse(cards,202,'Cards are not available'));

      }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "message": "Internal server error",
            "status": 500,
            "error": error
        })
    }
}

export async function updateCardProfile( req, res) {
    try {
       let cardId = req.params.cardId;
       let data = req.body;
       
      let result = await CardProfile.findByIdAndUpdate ({_id: cardId},{...data});

        data = await CardProfile.findById({_id:cardId});

        res.status(200).json(await getResponse(data,200,'Card profile updated successfully'));
      

    } catch (error) {
        console.log(error)
        res.status(500).json(await buildErrorResponse(error,500,'Internal server error'));
    }
}

export async function getCardById(req, res ) {
    try {
     let cardId = req.params.cardId;
     let cardData = await CardProfile.findById({_id: cardId})
    
     if (cardData) {

        res.status(200).json(await getResponse(cardData,200,'Card fetched successfully'));
     
    } else {

        res.status(204).json(await buildErrorResponse({},204,'Card not available'));
    }
    } catch (error) {

        console.log(error)
        res.status(500).json(await buildErrorResponse(error,500,'Internal server error'));
    
    }
}