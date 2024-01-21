"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
var UserDto = /** @class */ (function () {
    function UserDto(model) {
        this.id = model._id;
        this.type = model.type;
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
    }
    return UserDto;
}());
exports.UserDto = UserDto;
