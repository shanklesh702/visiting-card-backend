export default  {
    NOTAVAILABLE: (res,data, message = "")=> {
        return res.status(202).send({
           status: 202,
           sucess: false,
           data: data,
           message: message
        })
    },
    CREATED: (res, data, message = 'Data created successfully') => {
         return res.status(201).send({
             status: 201,
             success : true,
             data : data,
             message : message
    })
    },
    OK : (res, data, message = "data retrived successfully.") => {
        return res.status(200).send({
            status : 200,
            success : true,
            data : data,
            message : message
        })
    },
    ERROR : (res,error, message = "failed to retrived data.") => {
        return res.status(400).send({
            status : 400,
            success : false,
            error:error,
            message : message
        })
    },
    UNAUTHORIZE : (res, message = "Unauthorized access.") => {
        return res.status(401).send({
            status : 401,
            success : false,
            data : null,
            error: {},
            message : message
        })
    },
    SERVERERROR : (res, error = {'msg':'something went wrong'}, message = "Internal server error.") => {
        return res.status(500).send({
            status : 500,
            success : false,
            error:error,
            message : message
        })
    },
}

