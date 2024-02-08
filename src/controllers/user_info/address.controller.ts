import * as express from "express";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { Types } from "mongoose";
import { inject } from "inversify";
import { UserDetailsService } from "../../services/user_info/user.details.service";
import { requireAuth } from "../../middlewares/auth.middleware";

@controller("/address")
export class AddressController {
    private readonly userDetailsService: UserDetailsService;

    public constructor(
        @inject(UserDetailsService) userDetailsService: UserDetailsService,
    ) {
        this.userDetailsService = userDetailsService;
    }

    @httpPost("/add", requireAuth)
    public async addAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressData } = req.body;

        if (!Types.ObjectId.isValid(userId)) {
            return next(new Error("Invalid userId"));
        }
        try {
            await this.userDetailsService.addAddress(userId, addressData);
            res.status(200).json({ message: "Address was added successfully." });
        } catch (error) {
            next(error);
        }
    }

    @httpPut("/update", requireAuth)
    public async updateAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressData, addressId } = req.body;

        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            return next(new Error("Invalid userId or addressId"));
        }

        try {
            await this.userDetailsService.updateAddress(
                userId,
                addressId,
                addressData,
            );
            res.status(200).json({ message: "Address was updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpDelete("/delete", requireAuth)
    public async deleteAddressHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const { userId, addressId } = req.body;

        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
            return next(new Error("Invalid userId or addressId"));
        }

        try {
            await this.userDetailsService.deleteAddress(userId, addressId);
            res.status(200).json({ message: "Address was deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    @httpGet("/:id", requireAuth)
    public async getAddressesHandler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const id = req.params.id;

        if (!Types.ObjectId.isValid(id)) {
            return next(new Error("Invalid userId"));
        }

        try {
            const addresses = await this.userDetailsService.getAddresses(id);
            res.status(200).json(addresses);
        } catch (error) {
            next(error);
        }
    }
}
