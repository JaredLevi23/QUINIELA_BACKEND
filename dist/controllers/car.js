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
exports.deleteCar = exports.putCar = exports.postCar = exports.getCarById = void 0;
const car_1 = __importDefault(require("../models/car"));
const categories_1 = __importDefault(require("../models/categories"));
const products_1 = __importDefault(require("../models/products"));
const users_1 = __importDefault(require("../models/users"));
const getCarById = (req, res) => {
    const { idu } = req.params;
};
exports.getCarById = getCarById;
const postCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idu, idp } = req.params;
    const { car } = req.body;
    const user = yield users_1.default.findById(idu);
    const product = yield products_1.default.findById(idp);
    if (!user) {
        return res.status(400).json({
            msg: 'El usuario no existe',
        });
    }
    if (!product) {
        return res.status(400).json({
            msg: 'El producto no existe',
        });
    }
    product.car = car;
    const newCar = new car_1.default({
        user,
        products: [product]
    });
    yield newCar.save();
    return res.status(201).json({
        msg: 'Car creado',
        car: newCar
    });
});
exports.postCar = postCar;
const putCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idc } = req.params;
    const { car, idp } = req.body;
    const existCar = yield car_1.default.findById(idc);
    if (!existCar) {
        return res.status(400).json({
            msg: 'El carro no existe',
        });
    }
    const product = yield products_1.default.findById(idp);
    if (!product) {
        return res.status(200).json({
            msg: 'El producto no existe'
        });
    }
    let products = existCar.products;
    let con = false;
    for (let index = 0; index < products.length; index++) {
        if (product._id.equals(products[index]._id)) {
            con = true;
        }
    }
    if (con) {
        for (let index = 0; index < products.length; index++) {
            if (product._id.equals(products[index]._id)) {
                if (car <= 0) {
                    delete (products[index]);
                    yield car_1.default.findByIdAndUpdate(idc, { products: [...products] });
                }
                else {
                    products[index].car = car;
                    yield car_1.default.findByIdAndUpdate(idc, { products: [...products] });
                }
            }
        }
        const data = products;
        return res.status(200).json({
            msg: 'Carrito actualizado',
            products: data
        });
    }
    else {
        if (car > 0) {
            product.car = car;
            const newData = [...products, product];
            yield car_1.default.findByIdAndUpdate(idc, { products: [...newData] }, { new: true });
            const data = newData;
            return res.status(200).json({
                msg: 'Carrito actualizado',
                products: data
            });
        }
        return res.status(200).json({
            msg: 'Carrito actualizado',
        });
    }
});
exports.putCar = putCar;
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteCar = deleteCar;
//# sourceMappingURL=car.js.map