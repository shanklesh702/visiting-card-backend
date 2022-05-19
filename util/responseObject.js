
export async function getResponse(data,code,message) {

    return {
         "status": code,
         "message": message,
         "data":data
    }
}

export async function buildErrorResponse(error,code,message) {

    return {
         "status": code,
         "message": message,
         "error":error
    }
}

