
export async function getResponse(data,code,message) {

    return {
        "status": code,
         "message": message,
         "data":data
    }
}