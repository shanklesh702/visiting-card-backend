import User from "../models/users.js";
import { buildErrorResponse, getResponse } from "../util/responseObject.js";
import { validationResult } from "express-validator";
import CardProfile from "../models/cardProfile.js";
export async function createContacts(req, res) {

  try {
    const { userId, cardId, method } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    let user = await User.findById({ _id: userId })

    //insert contacts
    let obj = {
      "cardId": cardId,
      "method": method
    }
    user.contacts.push(obj);


    // update user
    await User.findByIdAndUpdate({ _id: userId }, { ...user, userId }, { new: true });

    user = await User.findById({ _id: userId }, { fullName: 1, email: 1, contacts: 1 })
    res.status(201).json(await getResponse(user, 201, 'Contact saved successfully'));

  } catch (error) {
    console.log(error)

    res.status(500).json(await getResponse(error, 500, 'Something went wrong, Please try after some time'));

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
      res.status(400).json(await buildErrorResponse('Bad request', 400, 'Pleae provide userId'));
    let user = await User.findById({ _id: userId }, { fullName: 1, email: 1, contacts: 1 }).populate("contacts.cardId");
    
     contacts = user.contacts || [];
    if (contacts && contacts.length > 0) {
     
      let result = await getContactsListBasedOnType(contacts, type, ismethod, limited, limit,page);
      res.status(200).json(await getResponse(result, 200, 'Contacts fetched successfully'));
    } else {
      console.log(error);
      res.status(400).json(await buildErrorResponse('Bad request', 400, 'User not found'));
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(await buildErrorResponse(error, 500, 'Something went wrong, Please try after some time'));

  }
}

export async function getGroupWiseContacts(req, res) {

  try {

    let { userId } = req.params;
    let { type } = req.query;

    let user = await User.findById({ _id: userId }).populate("contacts.cardId");

    let resObj = await prepareObj(user.contacts)

    res.status(200).json(await getResponse(resObj, 200, 'Contacts fetched successfully'));

  } catch (error) {

    res.status(500).json(await buildErrorResponse(error, 500, 'Something went wrong, Please try after some time'));

  }

}

const getContactsByCategory = (data, type, isLimited = "true", limit = 5,page=1) => {
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
          const _ci = JSON.parse(JSON.stringify(cardId));
          _ci.method = method || "";
          result.contacts.push(_ci);
        }
      } else {
        const { cardId, method } = e;
        const _ci = JSON.parse(JSON.stringify(cardId));
        _ci.method = method || "";
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
          const _ci = JSON.parse(JSON.stringify(cardId));
          _ci.method = method || "";
          result.contacts.push(_ci);
        }
      } else {
        const { cardId, method } = e;
        const _ci = JSON.parse(JSON.stringify(cardId));
        _ci.method = method || "";
        result.contacts.push(_ci);
      }
    })
  }
  return result;
}

const getContactsByMethod = (data, methodName, isLimited = "true", limit = 5, page = 1) => {
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
        let _ci = JSON.parse(JSON.stringify(cardId));
        _ci.method = method || "";
        result.contacts.push(_ci);
      }
    } else {
      const { cardId, method } = e;
      const _ci = JSON.parse(JSON.stringify(cardId));
      _ci.method = method || "";
      result.contacts.push(_ci);
    }
  })
  return result;
}

const getContactsOfMethod = (methods, data) => {
  let result = {};
  if (methods && methods.length > 0) {
    methods.forEach((method, index) => {
      result[method] = getContactsByMethod(data, method, true, 5);
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

async function prepareObj(userContacts) {
  return new Promise(async (resolve, reject) => {
    let resObj = {
      all: { contacts: [], total: 0 },
      work: { contacts: [], total: 0 },
      personal: { contacts: [], total: 0 }
    }
    const uMethods = getUniqueMethods(userContacts);
    resObj.work = getContactsByCategory(userContacts, "work");
    resObj.personal = getContactsByCategory(userContacts, "personal");
    resObj.all = getContactsByCategory(userContacts, "all");
    const methodResult = getContactsOfMethod(uMethods, userContacts);
    resObj = { ...resObj, ...methodResult };
    resolve(resObj);
  });
}


async function getContactsListBasedOnType(contacts, type, isMethod, limited, limit,page) {
  return new Promise((resolve, reject) => {
    let result = { contacts: [], total: 0, type: type };
    if (isMethod === "true") {
      result = getContactsByMethod(contacts, type, limited, limit,page);
    } else {
      result = getContactsByCategory(contacts, type, limited, limit,page);
    }
    result.isMethod = isMethod;
    result.type = type;
    result.isLimited = limited;
    result.limit = limit;
    resolve(result);
  });
}