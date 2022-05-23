
export async function getResponse(data,code,message,success = true) {

    return {
         "status": code,
         "message": message,
         "success": success,
         "data":data
    }
}

export async function buildErrorResponse(error,code,message) {
    return new Promise((resolve,reject)=>{
   
      resolve({
             "status": code,
             "message": message,
             "error":error
        })
            
   
    })
    
}

