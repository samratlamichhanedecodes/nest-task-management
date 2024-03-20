import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'taskmanagement',
    entities: [__dirname + '/../src/**/*.entity.js'],
});

export async function initializeDataSource() {
    try{

    }catch(error){
        console.error("Error during datasource initialization:", error);
    }
}