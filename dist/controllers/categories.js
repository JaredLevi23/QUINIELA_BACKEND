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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.putCategory = exports.postCategory = exports.getCategoryById = exports.getCategories = void 0;
const categories_1 = __importDefault(require("../models/categories"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield categories_1.default.find();
    return res.status(200).json({
        msg: 'GetCategories',
        categories
    });
});
exports.getCategories = getCategories;
const getCategoryById = (req, res) => {
    const { id } = req.params;
    return res.status(200).json({
        msg: 'GetCategoryById',
        id
    });
};
exports.getCategoryById = getCategoryById;
const postCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield categories_1.default.where({ name }).findOne();
    if (category) {
        return res.status(400).json({
            msg: 'La categoria ya existe',
            name
        });
    }
    const newCategory = new categories_1.default({
        name,
        description
    });
    yield newCategory.save();
    return res.status(201).json({
        msg: 'Categoria creada',
        category: newCategory
    });
});
exports.postCategory = postCategory;
const putCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { name } = _a, data = __rest(_a, ["name"]);
    console.log({ name, data });
    const category = yield categories_1.default.where({ _id: id }).findOne();
    if (!category) {
        return res.status(400).json({
            msg: 'La categoria no existe',
            name
        });
    }
    const update = yield categories_1.default.findByIdAndUpdate(id, data, { new: true });
    console.log(update);
    return res.status(200).json({
        msg: 'Categoria actualizada',
        category: update
    });
});
exports.putCategory = putCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield categories_1.default.where({ _id: id }).findOne();
    if (!category) {
        return res.status(400).json({
            msg: 'La categoria no existe',
            category: id
        });
    }
    const update = yield categories_1.default.findByIdAndUpdate(id, { enabled: false }, { new: true });
    return res.status(200).json({
        msg: 'Categoria actualizada',
        category: update
    });
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categories.js.map