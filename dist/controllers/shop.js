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
exports.postShop = exports.getShops = void 0;
const products_1 = __importDefault(require("../models/products"));
const shop_1 = __importDefault(require("../models/shop"));
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getShops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.header('x-token');
    const { uid } = jsonwebtoken_1.default.verify(token, (_a = process.env.SECRETORPRIVATEKEY) !== null && _a !== void 0 ? _a : '');
    const userAuth = yield users_1.default.findOne({ '_id': uid });
    if (!userAuth) {
        return res.status(401).json({
            msg: 'Token no valido - Usuario no existe'
        });
    }
    const shops = yield shop_1.default.where({ user: userAuth._id });
    const shl = shops.map((element) => {
        console.log('Element: ', element);
        const data = element.products;
        const pr = data.map((p) => {
            return {
                uid: p._id,
                name: p.name,
                price: p.price,
                exists: p.exists,
                description: p.description,
                category: p.category,
                car: p.car
            };
        });
        return {
            uid: element._id,
            user: element.user,
            date: element.date,
            products: pr
        };
    });
    console.log(shl);
    if (!shops) {
        return res.status(200).json({
            msg: 'No hay compras',
            shops
        });
    }
    return res.status(200).json({
        msg: 'Historial de compras',
        shops: shl
    });
});
exports.getShops = getShops;
const postShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = req.header('x-token');
    const { uid } = jsonwebtoken_1.default.verify(token, (_b = process.env.SECRETORPRIVATEKEY) !== null && _b !== void 0 ? _b : '');
    const userAuth = yield users_1.default.findOne({ '_id': uid });
    if (!userAuth) {
        return res.status(401).json({
            msg: 'Token no valido - Usuario no existe'
        });
    }
    // //Verificar si el usuario esta activo
    if (!userAuth.enabled) {
        return res.status(401).json({
            msg: 'Usuario desactivado'
        });
    }
    const { products } = req.body;
    const productList = [];
    for (let index = 0; index < products.length; index++) {
        const productFind = yield products_1.default.findById(products[index].uid);
        if (productFind) {
            productFind.car = products[index].car;
            productFind.uid = products[index].uid;
            const changeExists = productFind.exists - productFind.car;
            productList.push(productFind);
            yield products_1.default.findByIdAndUpdate(products[index].uid, { exists: changeExists });
        }
    }
    const shop = new shop_1.default({
        user: userAuth,
        products: productList
    });
    yield shop.save();
    return res.status(200).json({
        msg: 'Pedido guardado',
        shop
    });
});
exports.postShop = postShop;
//# sourceMappingURL=shop.js.map