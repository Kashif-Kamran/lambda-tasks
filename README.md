# SQS-Driven Serverless Data Workflow

## Introduction

This project is designed to provide hands-on experience with AWS Lambda, SQS, S3, and DynamoDB services, leveraging the Serverless Framework for deployment and management. The main goal is to understand how these services interact, especially in a serverless architecture, and to gain practical knowledge of AWS's capabilities in handling event-driven workflows.

The project simulates a data processing pipeline where data is read from an S3 bucket, converted into a CSV format, and stored back in S3. This triggers another Lambda function to read the CSV file and save the data into a DynamoDB table. The entire flow is initiated by an event in SQS.

## Learning Objectives

By working on this project, you will:
- Gain practical experience with AWS Lambda and the Serverless Framework.
- Understand how to use AWS SQS to trigger Lambda functions.
- Learn how to manage data in S3 buckets and integrate them with Lambda functions.
- Explore how to store and retrieve data in DynamoDB using Lambda.
- Develop skills in creating and deploying serverless applications.

## Used Technologies

- **AWS Lambda**: Used for executing the business logic in a serverless environment.
- **Amazon SQS (Simple Queue Service)**: Acts as an event source for triggering the Lambda functions.
- **Amazon S3 (Simple Storage Service)**: Used for storing the input and output data in CSV format.
- **Amazon DynamoDB**: A NoSQL database service used to store the final processed data.
- **Serverless Framework**: Facilitates the deployment and management of the serverless application, automating the configuration and deployment processes.

## Architecture Diagram

![Architecture_diagram](https://github.com/user-attachments/assets/71ed97b0-b718-4194-9db9-0a1990acb4c8)

The architecture diagram illustrates the flow of data and events across the AWS services used in this project.

## Disclaimer

This project is intended for educational purposes only. While the code and configuration provided can be used to set up a similar environment, it is advised to proceed with caution and understand the implications of deploying serverless applications in a production environment. The author is not responsible for any issues that may arise from the use of this code.

Use this project at your own risk.

---

**Happy Learning!**
