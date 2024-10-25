import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as  path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Increase the maximum number of listeners
require('events').EventEmitter.defaultMaxListeners = 20;

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Ensure these environment variables are set
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Function to upload CSV to S3
const uploadCSVToS3 = async (filePath: string, bucketName: string, key: string) => {
    try {
      const fileContent = fs.readFileSync(filePath);

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: 'text/csv',
      };
  
      const data = await s3.upload(params).promise();
      console.log(`File uploaded successfully. ETag: ${data.Location}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error uploading file: ${error.message}`);
      } else {
        console.error('Error uploading file:', error);
      }
    }
  };

const files = fs.readdirSync(path.join(__dirname, 'data', 'economy'));

const uploadFiles = async () => {
    for (const file of files) {
        const filePath = path.join(__dirname, 'data', 'economy', file); // Replace with your CSV file path
        const bucketName = process.env.AWS_S3_BUCKET_NAME || ''; // Replace with your S3 bucket name
        const keyFile = path.relative(__dirname, filePath).replace('data/', '');
        const key = keyFile;
        await uploadCSVToS3(filePath, bucketName, key);
    }
  };

uploadFiles();