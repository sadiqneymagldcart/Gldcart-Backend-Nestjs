import { ChatService } from "@services/chat/chat.service";
import { MessageService } from "@services/chat/message.service";
import { Container } from "inversify";

function bindChatServices(container: Container) {
    container.bind(ChatService).toSelf();
    container.bind(MessageService).toSelf();
}

export { bindChatServices };

