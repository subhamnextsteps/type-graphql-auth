import { MyContext } from '../types/MyContext';
import { AuthChecker } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'src/config';

export const customAuthChecker: AuthChecker<MyContext> = ({ context }, roles) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, JWT_SECRET_KEY);
    // console.log(payload);
    context.payload = payload as any;
    if (roles.length === 0) {
      // if `@Authorized()`, check only is user exist
      return context.payload !== undefined;
    }
    // there are some roles defined now
    if (!context.payload) {
      // and if no user, restrict access
      return false;
    }
    if (context.payload.roles.some(role => roles.includes(role))) {
      // grant access if the roles overlap
      return true;
    }
    // no roles matched, restrict access
    return false;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
};
