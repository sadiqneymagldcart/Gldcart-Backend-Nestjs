"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var VehicleSchema = new mongoose_1.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    price_day: { type: String, required: true },
    price_week: { type: String, required: true },
    price_month: { type: String, required: true },
    advantage1: { type: String, required: true },
    advantage2: { type: String, required: true },
    advantage3: { type: String, required: true },
    advantage4: { type: String, required: true },
    advantage5: { type: String, required: true },
    advantage6: { type: String, required: true },
    taxes: { type: String, required: true },
    total_price: { type: String, required: true },
    air_bags: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    driver_choice: { type: String, required: true },
    engine_capacity: { type: String, required: true },
    fuel_type: { type: String, required: true },
    item: { type: String, required: true },
    manufacture_year: { type: String, required: true },
    photos: [{ type: String }],
    promo_video: { type: String },
    rent_price: { type: String, required: true },
    renting_packages: { type: String, required: true },
    seat_capacity: { type: String, required: true },
    specification: { type: String, required: true },
    specification_details: { type: String, required: true },
    specifications_details: {
        storage_bag_capacity: { type: String, required: true },
    },
    subcategory: { type: String, required: true },
    time: { type: mongoose_1.Schema.Types.Mixed },
    vehicle_condition: { type: String, required: true },
    vehicle_number: { type: String, required: true },
});
var VehicleModel = mongoose_1.default.model('vehicles', VehicleSchema);
exports.default = VehicleModel;
