const SocketConfig = Object.freeze({
    PORT: 3000,
    ORIGIN: "http://localhost:5173",
    ALLOWED_HEADERS: "Origin, X-Requested-With, Content-Type, Accept",
    ALLOWED_METHODS: "GET, POST",
    ALLOWED_CREDENTIALS: true,
    EVENTS: {
        JOIN_ROOM: "join",
        LEAVE_ROOM: "leave",
        DISCONNECT: "disconnect",
    },
});

const ServerOptions = {
    cors: {
        origin: SocketConfig.ORIGIN,
        allowedHeaders: SocketConfig.ALLOWED_HEADERS,
        methods: SocketConfig.ALLOWED_METHODS,
        credentials: SocketConfig.ALLOWED_CREDENTIALS,
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
};

const ChatConfig = Object.freeze({
    NAMESPACE: "chat",
    EVENTS: {
        MESSAGE: "message",
        CONNECTION: "connection",
        NEW_CHAT: "newChat",
        CHATS: "chats",
    },
});

export { SocketConfig, ServerOptions, ChatConfig };
