import Categories from "../models/categories"

export const findCategory = async ( id: string ) => {

    const category = await Categories.findOne( { _id: id } ).exec();
    
    if( !category ){
        console.log('Middleware called');    
        throw new Error('La categoria no existe');
    }
}