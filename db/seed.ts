import { PrismaClient } from '@prisma/client';
import { products } from './data';


async function main() {

    const prisma = new PrismaClient();


    await prisma.product.deleteMany();

    for (let product of products) {
        await prisma.product.create({
            data: product
        });
    }
    console.log("database seed successful!");
}

main();