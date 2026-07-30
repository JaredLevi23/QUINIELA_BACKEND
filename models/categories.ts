
import { Schema, model } from "mongoose";


const CategoriesSchema: Schema = new Schema({

    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ],
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

CategoriesSchema.methods.toJSON = function(){

    const { __v, _id, enabled,...category } = this.toObject();
    category.uid = _id;
    return category;
}

const Categories = model( 'Categories', CategoriesSchema );
export default Categories;