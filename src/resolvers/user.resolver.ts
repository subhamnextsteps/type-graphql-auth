import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";
import { LoginResponse } from "../types/LoginResponse";
import { generateLoginAccessToken } from "../utils/helper";

@Resolver()
export class UserResolver {
  @Query(() => User)
  @Authorized("USER")
  async userProfile(@Ctx() { payload }: MyContext) {
    return await User.findOne({ where: { id: payload!.userId } });
  }

  @Mutation(() => Boolean)
  async userRegister(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error("Email exist");
    }
    const hashedPassword = await hash(password, 13);
    try {
      await User.insert({
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
  async userLogin(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Could not find user");
    }
    const verify = await compare(password, user.password);
    if (!verify) {
      throw new Error("Bad password");
    }
    return await generateLoginAccessToken({ userId: user.id, roles: ["USER"] });
  }
}
