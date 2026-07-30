import { Request, Response } from "express";
import Categories from "../models/categories";

export const getCategories = async ( req: Request, res: Response ) =>{

    const categories = await Categories.find();

    return res.status( 200 ).json({
        msg: 'GetCategories',
        categories
    });

}

export const getCategoryById = ( req: Request, res: Response ) =>{

    const { id } = req.params;

    return res.status( 200 ).json({
        msg: 'GetCategoryById',
        id
    });

}

export const postCategory = async ( req: Request, res: Response ) =>{

    const { name, description } = req.body;
    const category = await Categories.where( { name } ).findOne();

    if( category ){
        return res.status( 400 ).json({
            msg: 'La categoria ya existe',
            name
        });
    }

    const newCategory = new Categories({
        name,
        description
    });

    await newCategory.save();

    return res.status( 201 ).json({
        msg: 'Categoria creada',
        category: newCategory
    });
}

export const putCategory = async ( req: Request, res: Response ) =>{

    const { id } = req.params;
    const { name, ...data  } = req.body;

    console.log( {name, data} );
    

    const category = await Categories.where({ _id: id } ).findOne();

    if( !category ){
        return res.status( 400 ).json({
            msg: 'La categoria no existe',
            name
        });
    }

    const update = await Categories.findByIdAndUpdate( id, data, { new: true }  );

    console.log( update );
    
    return res.status(200).json({
        msg: 'Categoria actualizada',
        category: update
    });
}

export const deleteCategory = async ( req: Request, res: Response ) =>{

    const { id } = req.params;

    const category = await Categories.where({ _id: id } ).findOne();

    if( !category ){
        return res.status( 400 ).json({
            msg: 'La categoria no existe',
            category: id
        });
    }

    const update = await Categories.findByIdAndUpdate( id, { enabled: false }, { new: true }  );
    
    return res.status(200).json({
        msg: 'Categoria actualizada',
        category: update
    });

}