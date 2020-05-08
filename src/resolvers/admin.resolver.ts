import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { Admin } from "../entity/Admin";
import { MyContext } from "../types/MyContext";
import { LoginResponse } from "../types/LoginResponse";
import { generateLoginAccessToken } from "../utils/helper";

@Resolver()
export class AdminResolver {
  @Query(() => Admin)
  @Authorized("ADMIN")
  async adminProfile(@Ctx() { payload }: MyContext) {
    return await Admin.findOne({ where: { id: payload!.userId } });
  }

  @Mutation(() => Boolean)
  async adminRegister(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const admin = await Admin.findOne({ where: { email } });
    if (admin) {
      throw new Error("Email exist");
    }
    const hashedPassword = await hash(password, 13);
    try {
      await Admin.insert({
        name,
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async adminLogin(@Arg("email") email: string, @Arg("password") password: string) {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error("Could not find admin");
    }
    const verify = await compare(password, admin.password);
    if (!verify) {
      throw new Error("Bad password");
    }
    return await generateLoginAccessToken({ userId: admin.id, roles: ["ADMIN"] });
  }
}
