"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
// Middleware to validate DTOs using class-validator and class-transformer
// This middleware will transform the request body into an instance of the specified DTO class
// and validate it against the defined validation rules.
function validateDto(dtoClass) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const instance = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(instance, { whitelist: true });
        if (errors.length > 0) {
            return res.status(400).json({
                errors: errors.map((e) => ({
                    property: e.property,
                    constraints: e.constraints,
                })),
            });
        }
        // replace body with validated and transformed instance
        req.body = instance;
        next();
    });
}
//# sourceMappingURL=validate.js.map