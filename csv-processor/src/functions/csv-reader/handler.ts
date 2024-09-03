import { S3Event, S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { Readable } from 'stream';
import { DYNAMO_DB_CONSTRAINTS } from '@functions/configs/env.config';

const s3Client = new S3Client({});
const dynamoClient = new DynamoDBClient({});

export const main: S3Handler = async (event: S3Event) => {
    const record = event.Records[0];
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const getObjectParams = {
        Bucket: bucketName,
        Key: objectKey
    };

    const data = await s3Client.send(new GetObjectCommand(getObjectParams));
    const stream = data.Body as Readable;

    let processedData: { id?: string, username?: string, email?: string }[] = [];

    const collectData = new Promise<void>((resolve, reject) => {
        stream.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            lines.forEach((line: string) => {
                const [id, username, email] = line.split(',');
                if (id && username && email)
                {
                    processedData.push({ id, username, email });
                }
            });
        });

        stream.on('end', () => {
            resolve();
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });

    try
    {
        await collectData;


        processedData.shift();
        await Promise.all(processedData
            .filter((item) => {
                if (item.id)
                    return true
                return false
            })
            .map(async (item, index) => {
                const params: PutItemCommandInput = {
                    TableName: DYNAMO_DB_CONSTRAINTS.outputTableName,
                    Item: {
                        'id': { S: `${item.id || ''}-${Date.now()}` },
                        'username': { S: item.username || '' },
                        'email': { S: item.email || '' }
                    }
                };
                try
                {
                    await dynamoClient.send(new PutItemCommand(params));
                } catch (error)
                {
                    console.error("Error inserting item:", error);
                }
            }));

        console.log("Data Inserted to DynamoDB");

    } catch (error)
    {
        console.error("Error processing data:", error);
    }
};
