import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;

    // PrismaClientValidationError
    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = "You have provide incorrect field type or missing file!";
    }

    // PrismaClientKnownRequestError
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2025") {
            statusCode = 400;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
        else if(err.code === "2002") {
            statusCode = 400;
            errorMessage = "Duplicate key error"
        }
        else if(err.code === "2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraints failed."
        }
    }

    // PrismaClientUnknownRequestError
    else if(err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occured during query execution";
    }

    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}


export default errorHandler;