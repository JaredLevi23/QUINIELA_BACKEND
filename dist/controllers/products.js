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
exports.deleteProduct = exports.putProduct = exports.postProduct = exports.getProductByCategory = exports.getProductoByQuery = exports.getProductos = void 0;
const categories_1 = __importDefault(require("../models/categories"));
const products_1 = __importDefault(require("../models/products"));
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_1.default.where({ enabled: true }).populate({
        path: 'category',
        transform: (doc, id) => doc.name
    });
    return res.status(200).json({
        msg: 'Productos',
        products
    });
});
exports.getProductos = getProductos;
const getProductoByQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    const products = yield products_1.default.where({
        enabled: true,
        name: { $regex: query, $options: 'i' }
    }).limit(15).populate({
        path: 'category',
        transform: (doc, id) => doc.name
    });
    return res.status(200).json({
        msg: 'Productos',
        products
    });
});
exports.getProductoByQuery = getProductoByQuery;
const getProductByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    const existsCategory = yield categories_1.default.where({ _id: category }).findOne();
    if (!existsCategory) {
        return res.status(200).json({
            msg: 'La categoria no existe',
            products: []
        });
    }
    if (existsCategory.name === 'TODAS') {
        const products = yield products_1.default.where({ enabled: true }).populate({
            path: 'category',
            transform: (doc, id) => doc.name
        });
        return res.status(200).json({
            msg: 'Productos',
            products
        });
    }
    else {
        const products = yield products_1.default.where({ enabled: true, category }).populate({
            path: 'category',
            transform: (doc, id) => doc.name
        });
        return res.status(200).json({
            msg: 'Productos',
            products
        });
    }
    return res.status(200).json({
        msg: 'Productos',
        products: []
    });
});
exports.getProductByCategory = getProductByCategory;
const postProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, category, exists, } = req.body;
    const existsCategory = yield categories_1.default.where({ _id: category }).findOne();
    if (!category) {
        return res.status(400).json({
            msg: 'La categoria no existe',
        });
    }
    const product = new products_1.default({
        name, price, description, category, exists
    });
    yield product.save();
    return res.status(201).json({
        msg: 'Producto creado',
        product
    });
});
exports.postProduct = postProduct;
const putProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = __rest(req.body, []);
    const product = yield products_1.default.findById(id);
    if (!product) {
        return res.status(202).json({
            msg: 'Producto no encontrado',
            product: id
        });
    }
    const existProduct = yield products_1.default.findByIdAndUpdate(id, data, { new: true });
    return res.status(202).json({
        msg: 'Producto actualizado',
        product: existProduct
    });
});
exports.putProduct = putProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield products_1.default.findById(id);
    if (!product) {
        return res.status(406).json({
            msg: 'El producto no existe',
            product: id
        });
    }
    const productDelete = yield products_1.default.findByIdAndUpdate(id, { enabled: false }, { new: true });
    return res.status(202).json({
        msg: 'Producto eliminado',
        product: productDelete
    });
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products.js.map