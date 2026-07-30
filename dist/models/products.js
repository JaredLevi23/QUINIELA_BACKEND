"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductsSchema = new mongoose_1.Schema({
    uid: {
        type: String
    },
    name: {
        type: String,
        require: [true, 'El nombre del producto es obligatorio'],
        default: ''
    },
    price: {
        type: Number,
        require: [true, 'Se debe especificar un precio'],
        default: 0
    },
    exists: {
        type: Number,
        require: [true, 'Se debe colocar las existencias'],
        default: 0
    },
    description: {
        type: String,
        default: 'Sin descripción'
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Categories',
        default: ''
    },
    enabled: {
        type: Boolean,
        default: true
    },
    car: {
        type: Number,
        default: 0
    }
});
ProductsSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id, enabled } = _a, product = __rest(_a, ["__v", "_id", "enabled"]);
    product.uid = _id;
    return product;
};
const Products = (0, mongoose_1.model)('Products', ProductsSchema);
exports.default = Products;
//# sourceMappingURL=products.js.map