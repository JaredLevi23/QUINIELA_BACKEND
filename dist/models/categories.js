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
const CategoriesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    enabled: {
        type: Boolean,
        default: true
    }
});
CategoriesSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id, enabled } = _a, category = __rest(_a, ["__v", "_id", "enabled"]);
    category.uid = _id;
    return category;
};
const Categories = (0, mongoose_1.model)('Categories', CategoriesSchema);
exports.default = Categories;
//# sourceMappingURL=categories.js.map