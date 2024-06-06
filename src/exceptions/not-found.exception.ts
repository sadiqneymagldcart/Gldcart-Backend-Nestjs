import { ApiException } from "./api.exception";

class NotFoundException extends ApiException {
  public constructor(message: string) {
    super(404, "not_found", message);
  }
}
export { NotFoundException };
