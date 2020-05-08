import { sign } from "jsonwebtoken";
import { UserPayload } from "src/types/UserPayload";
import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from "../config";

export async function generateLoginAccessToken(payload: UserPayload) {
  return {
    accessToken: sign({ userId: payload.userId, roles: payload.roles }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN
    })
  };
}