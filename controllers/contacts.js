import User from "../models/users.js";
import { buildErrorResponse, getResponse } from "../util/responseObject.js";
import { validationResult } from "express-validator";
import CardProfile from "../models/cardProfile.js";
import Response_Obj from "../util/reponse.code.js"

export async function createContacts(req, res) {

  try {
    const { userId, cardId, method } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ error: errors.array() });
      return Response_Obj.ERROR(res,errors.array(),"please provide all details")
    }

    let user = await User.findById({ _id: userId })
    
    if (!user) {

      return Response_Obj.NOTAVAILABLE(res,req.body,'User id not available in the database');
   
    }
    //check wheather card available or not
    let cardCheck = await CardProfile.findById({_id: cardId});
    if (!cardCheck) {

      return Response_Obj.NOTAVAILABLE(res,req.body,'Card id not available in the database');
    
    }
    //insert contacts
    let obj = {
      "cardId": cardId,
      "method": method
    }
    user.contacts.push(obj);


    // update user
    let r = await User.findByIdAndUpdate({ _id: userId }, { ...user, userId }, { new: true });
   
    // user = await User.findById({ _id: userId }, { fullName: 1, email: 1, contacts: 1 })
    if (r) {
      
      return Response_Obj.CREATED(res,req.body,'Contact saved successfully')

    }else {

      return Response_Obj.SERVERERROR(res,{});

    }

  } catch (error) {
    console.log(error)
    return Response_Obj.SERVERERROR(res,error);

  }
}

export async function getAllContacts(req, res) {

  try {
    let { userId } = req.params;
    let { type, limited, limit, ismethod,page } = req.query;
    if (Number(limit) <= 0)
     limit = 1;
    let contacts = [];
    if (!userId)
      return Response_Obj.ERROR(res,{},'Bad request, Please provide userId');
  
    let user = await User.findById({ _id: userId }, { fullName: 1, email: 1, contacts: 1 }).populate("contacts.cardId");
     
     contacts = user.contacts || [];
    if (contacts && contacts.length > 0) {
      
      let result = await getContactsListBasedOnType(contacts, true,type, ismethod, limited, limit,page);
      
      return Response_Obj.OK(res,result,'Contacts fetched successfully');
      
    } else {
     let data = {
        "contacts": [],
        "total": 0
     }
      return Response_Obj.OK(res,data,'Contacts are not added yet');
  
    }
  } catch (error) {
    console.log(error)
    return Response_Obj.SERVERERROR(res,error);
    // res.status(500).json(await buildErrorResponse(error, 500, 'Something went wrong, Please try after some time'));

  }
}

export async function getGroupWiseContacts(req, res) {

  try {

    let { userId } = req.params;
    let { type } = req.query;

    let user = await User.findById({ _id: userId }).populate("contacts.cardId");

    let resObj = await prepareObj(user.contacts,false)

    if (resObj.length){
      
      return Response_Obj.OK(res,resObj,'Contacts fetched successfully')

    }else {

      return Response_Obj.NOTAVAILABLE(res,resObj,'Contacts are not added yet');

    }

  } catch (error) {

    return Response_Obj.SERVERERROR(res,{})
  
  }

}

const getContactsByCategory = (data, list, type, isLimited = "true", limit = 8,page=1) => {
  const result = { contacts: [], total: 0 };
  if (typeof type !== "string") return result;
  
    let startIndex = (Number(page) - 1) * Number(limit);
    let endIndex = startIndex + Number(limit);
   

  if (type === "all") {
    const tData = data;
    result.total = tData.length;
    tData.map((e, i) => {
      if (isLimited.toString() == "true") {
        if (i >= startIndex && i < endIndex) {
          const { cardId, method } = e;
          const _ci = {};
          _ci.id = cardId.id;
          _ci.profilePic = cardId.profilePic;
          _ci.name = cardId.name;
          // const _ci = JSON.parse(JSON.stringify(cardId));
          _ci.method = method || "";
          if (list){
            _ci.company =cardId.company;
            _ci.designation = cardId.designation;
            _ci.contact =cardId.contact;
          }
          result.contacts.push(_ci);
        }
      } else {
        const { cardId, method } = e;
        // const _ci = JSON.parse(JSON.stringify(cardId));
        const _ci = {};
        _ci.id = cardId.id;
        _ci.profilePic = cardId.profilePic;
        _ci.name = cardId.name;
        _ci.method = method || "";
        if (list){
          _ci.company =cardId.company;
          _ci.designation = cardId.designation;
          _ci.contact =cardId.contact;
        }
        result.contacts.push(_ci);
      }
    })
  } else {
    const tData = data.filter((element) => element.cardId.type == type)
    result.total = tData.length;
    tData.map((e, i) => {
      if (isLimited.toString() == "true") {
        if (i >= startIndex && i < endIndex) {
          const { cardId, method } = e;
          // const _ci = JSON.parse(JSON.stringify(cardId));
        const _ci = {};
        _ci.id = cardId.id;
        _ci.profilePic = cardId.profilePic;
        _ci.name = cardId.name;
          _ci.method = method || "";
          if (list){
            _ci.company =cardId.company;
            _ci.designation = cardId.designation;
            _ci.contact =cardId.contact;
          }
          result.contacts.push(_ci);
        }
      } else {
        const { cardId, method } = e;
        // const _ci = JSON.parse(JSON.stringify(cardId));
        const _ci = {};
        _ci.id = cardId.id;
        _ci.profilePic = cardId.profilePic;
        _ci.name = cardId.name;
        _ci.method = method || "";
        if (list){
          _ci.company =cardId.company;
          _ci.designation = cardId.designation;
          _ci.contact =cardId.contact;
        }
        result.contacts.push(_ci);
      }
    })
  }
  return result;
}

const getContactsByMethod = (data,list, methodName, isLimited = "true", limit = 8, page = 1) => {
  const result = { contacts: [], total: 0 };
  if (typeof methodName !== "string") return result;
  let startIndex = (Number(page) - 1) * Number(limit);
  let endIndex = startIndex + Number(limit);
  const tData = data.filter((element) => element.method == methodName)
  result.total = tData.length;
  tData.map((e, i) => {
    if (isLimited.toString() == "true") {
      if (i >= startIndex && i < endIndex) {
        let { cardId, method } = e;
        //  let _ci = JSON.parse(JSON.stringify(cardId));
        const _ci = {};
        _ci.id = cardId.id;
        _ci.profilePic = cardId.profilePic;
        _ci.name = cardId.name;
        _ci.method = method || "";
        if (list){
          _ci.company =cardId.company;
          _ci.designation = cardId.designation;
          _ci.contact =cardId.contact;
        }
        result.contacts.push(_ci);
      }
    } else {
      const { cardId, method } = e;
      // const _ci = JSON.parse(JSON.stringify(cardId));
      const _ci = {};
      _ci.id = cardId.id;
      _ci.profilePic = cardId.profilePic;
      _ci.name = cardId.name;
      _ci.method = method || "";
      if (list){
        _ci.company =cardId.company;
        _ci.designation = cardId.designation;
        _ci.contact =cardId.contact;
        
      }
      result.contacts.push(_ci);
    }
  })
  return result;
}

const getContactsOfMethod = (methods, data,list) => {
  
  let result = [];
  let group = {
    groupName : '',
    total: '',
    contacts: []
  }
  if (methods && methods.length > 0) {
    methods.forEach((method, index) => {
      let obj = {};
      obj = getContactsByMethod(data,list, method, true, 8);
      group.groupName =  method;
      group.total = obj.total;
      group.contacts = obj.contacts;
      result.push(group);

      group = {
        groupName : '',
        total: '',
        contacts: []
      }
    })
  }
  return result;
}


const getUniqueMethods = (data) => {
  let result = [];
  var uniqueValues = [];
  if (data && data.length > 0) {
    data.forEach((item) => {
      result.push(item.method);
    })
    uniqueValues = new Set([...result]);
  }
  result = uniqueValues;
  return [...result];
}
const getUniqueCategory = (data) => {
  let result = [];
  var uniqueValues =[];
  if (data && data.length > 0) {
    data.forEach((item) => {
      result.push(item.cardId.type);
    })
    uniqueValues = new Set([...result]);
  }
  result = uniqueValues;
  return [...result];
}
async function prepareObj(userContacts,list =false) {
  return new Promise(async (resolve, reject) => {
    let resObj = {
      all: { contacts: [], total: 0 },
      work: { contacts: [], total: 0 },
      personal: { contacts: [], total: 0 }
    }
    let data = [];
    let group = {
      groupName : '',
      total: '',
      contacts: []
    }
    const uMethods = getUniqueMethods(userContacts);
    const uCategory= getUniqueCategory(userContacts);
    let type = [...uCategory, 'all'];
    type.forEach((typ => {
      let obj = {};
      obj= getContactsByCategory(userContacts,list, typ);
      group.groupName = typ;
      group.total = obj.total;
      group.contacts = obj.contacts;
      
      if (group.contacts.length > 0)
      data.push(group);
      
      group = {
        groupName : '',
        total: '',
        contacts: []
      }
    }))
    
     const methodResult = getContactsOfMethod(uMethods, userContacts,list);
     data = [ ...data,...methodResult]
     resolve(data);
  });
}


async function getContactsListBasedOnType(contacts,list, type, isMethod, limited, limit,page) {
  return new Promise((resolve, reject) => {
    let result = { contacts: [], total: 0, type: type };
    if (isMethod === "true") {
      result = getContactsByMethod(contacts,list, type, limited, limit,page);
    } else {
      result = getContactsByCategory(contacts,list, type, limited, limit,page);
    }
    result.isMethod = isMethod;
    result.type = type;
    result.isLimited = limited;
    result.limit = limit;
    resolve(result);
  });
}