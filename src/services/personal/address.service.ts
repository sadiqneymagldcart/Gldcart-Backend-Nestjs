import { BaseService } from "../base/base.service";
import { Logger } from "@utils/logger";
import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { UserService } from "@services/user/user.service";
import { IAddress } from "@models/personal/Address";

@injectable()
export class AddressService extends BaseService {
    private readonly userService: UserService;

    public constructor(
        @inject(Logger) logger: Logger,
        @inject(UserService) userService: UserService,
    ) {
        super(logger);
        this.userService = userService;
    }

    public async addAddress(userId: string, addressData: IAddress) {
        if (!Types.ObjectId.isValid(userId)) {
            this.logger.logError(`Invalid userId: ${userId}`);
            throw new BadRequestException("Invalid userId");
        }

        const user = await this.userService.getUserById(userId);

        if (!user) {
            this.logger.logError(`User ${userId} not found while adding address`);
            throw new BadRequestException("User not found");
        }

        const newAddressId = new Types.ObjectId();
        const addressWithId = { ...addressData, id: newAddressId };

        user.addresses.push(addressWithId);
        await user.save();
        this.logger.logInfo(`Address added for user ${userId}`);
        return user;
    }

    public async updateAddress(
        userId: string,
        addressId: string,
        addressData: IAddress,
    ) {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            this.logger.logError(
                `Invalid userId: ${userId} or addressId: ${addressId}`,
            );
            throw new BadRequestException("Invalid userId or addressId");
        }

        const user = await this.userService.getUserById(userId);

        if (!user) {
            this.logger.logError(
                `User ${userId} was not found while updating address for email`,
            );
            throw new BadRequestException("User not found");
        }
        const addressIndex = user.addresses.findIndex(
            (address: IAddress) => address._id?.toString() === addressId,
        );
        if (addressIndex === -1) {
            this.logger.logError(`Address was not found for user ${userId}`);
            throw new BadRequestException("Address not found");
        }
        Object.assign(user.addresses[addressIndex], addressData);
        await user.save();
        this.logger.logInfo(`Address was updated for user ${userId}`);
    }

    public async getAddresses(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            this.logger.logError(`Invalid userId: ${userId}`);
            throw new BadRequestException("Invalid userId");
        }

        const user = await this.userService.getUserById(userId);
        if (!user) {
            this.logger.logError(
                `User not found while fetching addresses for ID: ${userId}`,
            );
            throw new BadRequestException("User not found");
        }
        return user.addresses;
    }

    public async deleteAddress(userId: string, addressId: string) {
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            this.logger.logError(
                `Invalid userId: ${userId} or addressId: ${addressId}`,
            );
            throw new BadRequestException("Invalid userId or addressId");
        }

        const user = await this.userService.getUserById(userId);
        if (!user) {
            this.logger.logError(
                `User ${userId} not found while deleting address for email`,
            );
            throw new BadRequestException("User not found");
        }

        const addressIndex = user.addresses.findIndex(
            (address: IAddress) => address._id?.toString() === addressId,
        );
        if (addressIndex === -1) {
            this.logger.logError(`Address not found for user ${userId}`);
            throw new BadRequestException("Address not found");
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();

        this.logger.logInfo(`Address was deleted for user ${userId}`);
        return user;
    }
}
