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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCategory = void 0;
const categories_1 = __importDefault(require("../models/categories"));
const findCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categories_1.default.findOne({ _id: id }).exec();
    if (!category) {
        console.log('Middleware called');
        throw new Error('La categoria no existe');
    }
});
exports.findCategory = findCategory;
//# sourceMappingURL=validate-data.js.map