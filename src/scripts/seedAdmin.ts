import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";


async function seedAdmin () {
    try{
        console.log('******** Admin Seeding Started....');
        const adminData = {
            name: "Admin5 Saheb",
            email: "admin5@admin.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }
        console.log("***** Checking Admin Exist or Not.....");
        // check user existence in the DB
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email as string
            }
        });

        if(existingUser) {
            throw new Error("User Already Exists in DB!");
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000",
            },
            body: JSON.stringify(adminData)
        })

        // console.log("sign up admin: ",signUpAdmin);

        if(signUpAdmin.ok) {
            console.log("******* New Admin Has Been Created......");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });

            console.log("***** Email Verification Status Has Been Updated.....");
        }

        console.log("******* SUCCESS ********");

    }
    catch(error){
        console.error(error);
    }
}


seedAdmin();








// import { prisma } from "../lib/prisma";
// import { UserRole } from "../middleware/auth";


// async function seedAdmin() {
//     try {
//         console.log("***** Admin Seeding Started....")
//         const adminData = {
//             name: "Admin4 Saheb",
//             email: "admin4@admin.com",
//             role: UserRole.ADMIN,
//             password: "admin1234"
//         }
//         console.log("***** Checking Admin Exist or not")
//         // check user exist on db or not
//         const existingUser = await prisma.user.findUnique({
//             where: {
//                 email: adminData.email
//             }
//         });

//         if (existingUser) {
//             throw new Error("User already exists!!");
//         }

//         const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Origin": "http://localhost:4000",
//             },
//             body: JSON.stringify(adminData)
//         })

//         console.log(signUpAdmin);

//         if (signUpAdmin.ok) {
//             console.log("**** Admin created")
//             await prisma.user.update({
//                 where: {
//                     email: adminData.email
//                 },
//                 data: {
//                     emailVerified: true
//                 }
//             })

//             console.log("**** Email verification status updated!")
//         }
//         console.log("******* SUCCESS ******")

//         // console.log(signUpAdmin)

//     } catch (error) {
//         console.error(error);
//     }
// }

// seedAdmin()