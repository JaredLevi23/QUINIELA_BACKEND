"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const shop_1 = require("../controllers/shop");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = require("../middlewares/validate-jwt");
const router = (0, express_1.Router)();
router.get('/', [
    validate_jwt_1.validarJWT,
    validate_fields_1.validation
], shop_1.getShops);
router.post('/', [
    validate_jwt_1.validarJWT,
    (0, express_validator_1.check)('products', 'La lista de productos es obligatoria').notEmpty(),
    validate_fields_1.validation
], shop_1.postShop);
exports.default = router;
//# sourceMappingURL=shop.js.map