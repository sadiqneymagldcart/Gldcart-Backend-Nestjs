import { AwsStorage } from "@storages/aws.storage";
import { Container } from "inversify";

function bindStorages(container: Container) {
    container.bind(AwsStorage).toSelf();
}

export { bindStorages };

