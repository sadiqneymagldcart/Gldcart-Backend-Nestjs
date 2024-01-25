import {BaseService} from "../base.service";
import {ApiError} from "../../exceptions/api.error";
import {Logger} from "../../utils/logger";
import {IAddress} from "../../models/Address";
import User, {IUser} from "../../models/User";
import {Types} from "mongoose";

export class UserDetailsService extends BaseService{

    constructor(logger:Logger) {
        super(logger);
    }
    public async addAddress(userId: string, addressData: IAddress) {
        const user = await User.findById(userId);

        if (!user) {
            await this.logger.logError(`User ${userId} not found while adding address`);
            throw ApiError.BadRequest("User not found");
        }

        const newAddressId = new Types.ObjectId();
        const addressWithId = {...addressData, id: newAddressId};

        user.addresses.push(addressWithId);
        await user.save();
        await this.logger.logInfo(`Address added for user ${userId}`, user.addresses);
        return user;
    }

     public async updateAddress(userId: string, addressId: Types.ObjectId, addressData: IAddress) {
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            await this.logger.logError(`User ${userId} was not found while updating address for email`);
            throw ApiError.BadRequest('User was not found');
        }
        const addressIndex = user.addresses.findIndex(address => String(address.id) === String(addressId));
        if (addressIndex === -1) {
            await this.logger.logError(`Address was not found for user ${userId}`);
            throw ApiError.BadRequest('Address was not found');
        }
        Object.assign(user.addresses[addressIndex], addressData);
        await user.save();
        await this.logger.logInfo(`Address was updated for user ${userId}`);
    }

    async getAddresses(id: string) {
        const user: IUser | null = await User.findById(id);
        if (!user) {
            await this.logger.logError(`User not found while fetching addresses for ID: ${id}`);
            throw ApiError.BadRequest('User not found');
        }
        return user.addresses;
    }

    async deleteAddress(userId: string, addressId: Types.ObjectId) {
        const user = await User.findById(userId);
        if (!user) {
            await this.logger.logError(`User ${userId} not found while deleting address for email`);
            throw ApiError.BadRequest("User not found");
        }

        const addressIndex = user.addresses.findIndex(address => String(address.id) === String(addressId));
        if (addressIndex === -1) {
            await this.logger.logError(`Address not found for user ${userId}`);
            throw ApiError.BadRequest('Address not found');
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();

        await this.logger.logInfo(`Address deleted for user ${userId}`);
        return user;
    }

    async updatePersonalDetails(id: string | null, email: string | null, name: string | null, surname: string | null, phone_number: string | null, address: string | null, BIO: string | null) {
        const user = <IUser>(
            await User.findByIdAndUpdate(id, {
                name: name,
                surname: surname,
                email: email,
                phone_number: phone_number,
                address: address,
                BIO: BIO
            })
        );
        if (!user) {
            await this.logger.logError(`User not found while updating details for ID: ${id}`);
            throw ApiError.BadRequest("User not found");
        }
        await user.save();
        await this.logger.logInfo(`Personal details updated for user with ID: ${id}`);
    }
}