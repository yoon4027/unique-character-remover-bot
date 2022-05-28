import { ApplyOptions } from "@sapphire/decorators";
import { ApiRequest, ApiResponse, methods, Route } from "@sapphire/plugin-api";

@ApplyOptions<Route.Options>({
  route: "/",
})
export class UserRoute extends Route {
  public [methods.GET](_req: ApiRequest, reply: ApiResponse) {
    return reply.status(200).respond({
      message: "Hello, World!",
      completed: true,
    });
  }
}
