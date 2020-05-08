import { Resolver, Query, Authorized } from "type-graphql";

@Resolver()
export class IndexResolver {
  @Query(() => String)
  async hello() {
    return "hello world -- any one can access";
  }

  @Query(() => String)
  @Authorized("ADMIN")
  async helloAdminOnly() {
    return "hello world -- only login admin can access";
  }

  @Query(() => String)
  @Authorized("USER")
  async helloUserOnly() {
    return "hello world -- only login user can access";
  }

  @Query(() => String)
  @Authorized(["ADMIN", "USER"])
  async helloAnyOrBoth() {
    return "hello world -- any login admin/user or both can access";
  }

  @Query(() => String)
  @Authorized()
  async helloAll() {
    return "hello world -- any login user can access";
  }
}