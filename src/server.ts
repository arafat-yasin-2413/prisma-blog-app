import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
    try{
        await prisma.$connect();
        console.log('Connected to database successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running at on Port : ${PORT}`);
        })
    }catch(error) {
        console.error("An Error Occured: ", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();