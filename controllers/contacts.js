import User from "../models/users.js";
import { buildErrorResponse, getResponse } from "../util/responseObject.js";
import { validationResult } from "express-validator";
import CardProfile from "../models/cardProfile.js";
export async function createContacts ( req, res) {

    try {
       const { userId, cardId } = req.body;
       const errors = validationResult(req);

       if (!errors.isEmpty()) {
         return res.status(400).json({ error: errors.array() });
       }
   
        let user = await User.findById({_id: userId})
            
        //insert contacts
         user.contacts.push(cardId);
        
         // update user
         await User.findByIdAndUpdate({_id: userId},{...user,userId},{new: true});
         
         user = await User.findById({_id: userId},{fullName:1,email:1,contacts:1})
         res.status(201).json(await getResponse(user,201,'Contact saved successfully'));

    } catch (error ) {
        console.log(error)

        res.status(500).json(await getResponse(error,500,'Something went wrong, Please try after some time'));

    }
}

export async function getAllContacts( req, res) {

    try {
      let userId = req.params.userId;
      let contacts = []; 
      if (userId === undefined) {

        res.status(400).json(await buildErrorResponse('Bad request',400,'Pleae provide userId'));

      }

      let user = await User.findById({_id: userId});

      if (user) {
         
        //iterate user.contacts and get data from database
        for (let i =0; i < user.contacts.length; i++) {
            if (user.contacts[i]) {
              let obj = await CardProfile.findById({_id:user.contacts[i]});
              contacts.push(obj)
            }
        };
         
         res.status(200).json(await getResponse({contacts},200,'Contacts fetched successfully'));

      }else {
        console.log(error)
        res.status(400).json(await buildErrorResponse('Bad request',400,'User not found'));

      }

    } catch (error) {

        console.log(error)     
        res.status(500).json(await buildErrorResponse(error,500,'Something went wrong, Please try after some time'));

    }
}