1. [ ] Handle lost socket connection, recover socket(id, rooms, missed packets) (https://socket.io/docs/v4/connection-state-recovery).
At the moment, all missed packets are stored in memory. Use Redis Streams or MongoDb adapter?

2. [ ] Implement product recommendations based on rating.

3. [ ] Set up OTP verification via third-party service.

4. [ ] Move all model interfaces to the ts/interfaces folder.

5. [ ] The UserModel must be used only in the UserService 




