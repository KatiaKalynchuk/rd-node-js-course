import * as userService from '../../../services/users.service.js';
import { parseRequestData } from '../../../utils/parseRequestData.js';
import { sendResponse } from '../../../utils/sendResponse.js';

export async function GET(req, res, params) {
  const user = await userService.getUserById(params.id);
  if (!user) {
    sendResponse(res, 404, { error: 'Not Found' });
    return;
  }
  sendResponse(res, 200, user);
}

export async function PUT(req, res, params) {
  const data = await parseRequestData(req);

  const updated = await userService.updateUser(params.id, data);
  if (!updated) {
    sendResponse(res, 404, { error: 'Not Found' });
    return;
  }
  sendResponse(res, 200, updated);
}

export async function DELETE(req, res, params) {
  const deleted = await userService.deleteUser(params.id);

  if (!deleted) {
    sendResponse(res, 404, { error: 'Not Found' });
    return;
  }
  sendResponse(res, 204, {});
}
