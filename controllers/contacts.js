import User from "../models/users.js";
import { getResponse } from "../util/responseObject.js";
import { validationResult } from "express-validator";
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