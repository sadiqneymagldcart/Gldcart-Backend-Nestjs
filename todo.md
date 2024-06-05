1. [ ] Handle lost socket connection, recover socket(id, rooms, missed packets) (https://socket.io/docs/v4/connection-state-recovery).
At the moment, all missed packets are stored in memory. Use Redis Streams or MongoDb adapter?

2. [ ] Implement product recommendations based on rating.

3. [ ] Set up OTP verification via third-party service.

4. [x] The UserModel must be used only in the UserService 

5. [x] Sockets have to be injectable => set up http server elsewhere (inversify.config)

6. [ ] Handle user disconnect. Online status is not being updated properly.

7. [ ] Create config for server, mongoose. Place all process.env inside config folder



