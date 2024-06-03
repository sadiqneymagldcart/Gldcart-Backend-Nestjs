import { AddressService } from "@services/personal/address.service";
import { Container } from "inversify";

function bindContactServices(container: Container) {
    container.bind(AddressService).toSelf();
}

export { bindContactServices };

