/**
 * Script de un solo uso: convierte el campo `role` de los usuarios existentes
 * (antes `Number`, p. ej. 0) al nuevo formato `String` basado en `UserRole`.
 *
 * Uso: npx ts-node scripts/migrate-user-roles.ts
 */
import 'dotenv/config';
import mongoose from "mongoose";
import { UserRole } from "../helpers/enums";

const validRoles: string[] = Object.values( UserRole );

const run = async () => {
    await mongoose.connect( process.env.MONGODB_CNN! );

    const collection = mongoose.connection.collection('users');
    const users = await collection.find({}).toArray();

    let updated = 0;

    for( const user of users ){
        if( !validRoles.includes( user.role ) ){
            await collection.updateOne(
                { _id: user._id },
                { $set: { role: UserRole.USER } }
            );
            updated++;
        }
    }

    console.log(`Roles migrados: ${ updated } de ${ users.length } usuarios actualizados a '${ UserRole.USER }'.`);
    console.log(`Recuerda promover manualmente al primer administrador, por ejemplo:`);
    console.log(`  db.users.updateOne({ email: "admin@correo.com" }, { $set: { role: "${ UserRole.ADMIN }" } })`);

    await mongoose.disconnect();
}

run().catch( ( err ) => {
    console.error( err );
    process.exit(1);
});
