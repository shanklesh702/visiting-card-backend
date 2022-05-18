import CardProfile from "../models/cardProfile.js";
import { getResponse } from "../util/responseObject.js";
export async function createCard(req, res) {

    try {
        console.log("user",req.user)
        let data = req.body;
        console.log("data",data)
        let cardData = new CardProfile({
            ...data,
            userId: req.user._id
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
      let cards = await CardProfile.find({userId:req.user._id});
      
      if (cards.length) {

        res.status(200).json(await getResponse(cards,200,'Data found'));

      } else {

        res.status(404).json(await getResponse(cards,404,'Cards are not available'));

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