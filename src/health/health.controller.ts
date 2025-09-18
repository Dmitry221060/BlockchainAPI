import { Get, Controller } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("healthz")
  healthz() {
    return {};
  }
}
