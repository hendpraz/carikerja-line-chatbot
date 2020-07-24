import handler from "../libs/handler-lib";
import VillageUser from '../models/VillageUser';
import { connectToDatabase } from '../libs/db';

// Village Administrator SubsPlan = 4
const VILLAGE_USER = 3;
const VILLAGE_ADMIN = 4;

const validateAdmin = (identityId, village) => {
  await connectToDatabase();

  const foundUser = VillageUser.findOne({
    user_id: identityId
  });

  if (foundUser) {
    if ((foundUser.village == village) && (foundUser.subscription_plan == VILLAGE_ADMIN)){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const createVillageAdmin = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundUser = VillageUser.findOne({
    user_id: data.user_id
  });

  if (foundUser) {
    if (foundUser.village == data.village) {
      foundUser.subscription_plan = VILLAGE_ADMIN;
      await foundUser.save();
    } else {
      throw new Error("Invalid combination of user and village");
    }
  } else {
    throw new Error("User not found");
  }

  return { message: "OK" };
});

export const getVillageAdmin = handler(async (event, context) => {  
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundUser = await VillageUser.findOne(
    { user_id: data.user_id, subscription_plan: VILLAGE_ADMIN, village: data.village }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  return { message: "OK", admin: foundUser };
});

export const listVillageAdmin = handler(async (event, context) => {
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundUser = await VillageUser.find(
    { village: data.village, subscription_plan: VILLAGE_ADMIN }
  );

  return { message: "OK", admin_list: foundUser };
});

export const updateVillageAdmin = handler(async (event, context) => {  
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundUser = await VillageUser.findOne(
    { user_id: data.user_id, subscription_plan: VILLAGE_ADMIN, village: data.village }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  foundUser.name = data.name;
  foundUser.phone_number = data.phone_number;
  foundUser.address = data.address;
  await foundUser.save();

  return { message: "OK" };
});

export const revokeVillageAdmin = handler(async (event, context) => {  
  console.log(event.body);
  const data = JSON.parse(event.body);
  const identityId = event.requestContext.identity.cognitoIdentityId;
  // Validate User First
  validateAdmin(identityId, data.village);

  // await connectToDatabase();
  const foundUser = await VillageUser.findOne(
    { user_id: data.user_id, subscription_plan: VILLAGE_ADMIN, village: data.village }
  );

  if (!foundUser) {
    throw new Error("Admin not found");
  }

  foundUser.subscription_plan = VILLAGE_USER;
  await foundUser.save();

  return { message: "OK" };
});