import { buildErrorResponse, getResponse } from '../util/responseObject.js';


export async function uploadImage(req,res){
    
    try {

      res.status(201).send(await getResponse({"filePath":'/' +req.file.path},201,'Image saved successfully',true));
       
    } catch (error) {
        console.log(error)
        let r = await buildErrorResponse(error,500,'Somthing went wrong, Please try again',false)
        res.status(500).send(r);
    }
}