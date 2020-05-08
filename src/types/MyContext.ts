import { Request, Response } from "express";
import { UserPayload } from "./UserPayload";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: UserPayload;
}
