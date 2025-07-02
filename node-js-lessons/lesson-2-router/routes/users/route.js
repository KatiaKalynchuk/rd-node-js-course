import * as userService from '../../services/users.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { parseRequestData } from '../../utils/parseRequestData.js';

export async function GET(req, res) {
  const users = await userService.getAllUsers();
  sendResponse(res, 200, users);
}

export async function POST(req, res) {
  const data = await parseRequestData(req);
  const newUser = await userService.createUser(data);
  sendResponse(res, 201, newUser);
}
