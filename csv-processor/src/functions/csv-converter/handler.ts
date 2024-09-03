
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path'
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import { S3_BUCKET_CONSTRAINTS, DYNAMO_DB_CONSTRAINTS } from '@functions/configs/env.config';
const dynamoClient = new DynamoDBClient({})
const s3Client = new S3Client({})
export const main: SQSHandler = async (event: SQSEvent) => {
    try
    {
        console.log('Received SQS Event : ', event);
        const data = await dynamoClient.send(new ScanCommand({ TableName: DYNAMO_DB_CONSTRAINTS.inputTableName }));
        const processedData = data.Items?.map((item) => {
            return {
                id: item.id.S,
                username: item.username.S,
                email: item.email.S
            }
        });

        console.log("Data from DynamoDB : ", JSON.stringify(processedData, null, 2));


        const csvFilePath = path.join('/tmp', `processed-data-${Date.now()}.csv`);
        const csvWriter = createObjectCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'username', title: 'Username' },
                { id: 'email', title: 'Email' },
            ],
        });

        await csvWriter.writeRecords(processedData || []);
        console.log('CSV file created:', csvFilePath);
        const fileContent = fs.readFileSync(csvFilePath);
        const bucketName = S3_BUCKET_CONSTRAINTS.bucketName;
        const s3Key = `csv-files/processed-data-${Date.now()}.csv`;

        const uploadParams = {
            Bucket: bucketName,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'text/csv',
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`CSV file uploaded to S3: ${bucketName}/${s3Key}`);
    }
    catch (error)
    {
        console.log("Error Occured : ", error)
    }
}