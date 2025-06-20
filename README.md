﻿# Serverless URL Shortener on AWS

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23323330?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A highly scalable, cost-effective URL shortener application built entirely on serverless AWS services. This project demonstrates a complete, production-ready cloud architecture, from DNS and content delivery to backend logic and database management, all served from a single custom domain.

## Live Demo


---

## Architecture

This application uses a single CloudFront distribution as the main entry point to intelligently route traffic to either the S3 frontend or the API Gateway backend based on the request path. This is a common and robust pattern for modern web applications.

**Request Flow:**

1.  **DNS:** A user accesses `shorterurl.yaredmekonnen.click`. **Amazon Route 53** resolves this custom domain via an `A` (Alias) record to the CloudFront distribution.
2.  **CDN & Routing:** **Amazon CloudFront** receives the request and provides HTTPS security using a certificate from **AWS Certificate Manager (ACM)**. It then inspects the request path to decide where to send it:
    * If the path is for an API call (e.g., `/shorten` or a 7-character short ID like `/Jz7xK3P`), a specific **Behavior** forwards the request to API Gateway.
    * For any other path (the **Default `*` Behavior**), CloudFront serves the static frontend (HTML, CSS, JavaScript) from a private S3 bucket.
3.  **Frontend:** The user interface is hosted in an **Amazon S3** bucket. The bucket is kept private by using an **Origin Access Control (OAC)**, ensuring content is only accessible through CloudFront.
4.  **API Layer:** **Amazon API Gateway** receives requests from CloudFront, validates them, and triggers the appropriate Lambda function.
5.  **Backend Logic:** **AWS Lambda** functions (written in Node.js) contain the core business logic:
    * `createShortUrl`: Generates a unique ID for a given long URL and saves the mapping to the database.
    * `getRedirectUrl`: Looks up a short ID in the database and returns a 301 redirect response with the original long URL.
6.  **Database:** **Amazon DynamoDB** serves as the NoSQL database, storing the mapping between short IDs and long URLs. It provides single-digit millisecond latency, perfect for fast redirects.
7.  **Permissions:** **AWS IAM** roles are configured to grant the Lambda functions the precise permissions needed to interact with DynamoDB and to write logs to CloudWatch, following the principle of least privilege.

### Architecture Diagram

![Architecture Diagram](https://user-images.githubusercontent.com/your-username/your-repo/assets/architecture.png)  ---

## Features

* **Custom Domain:** The entire application is served securely from `https://shorterurl.yaredmekonnen.click`.
* **URL Shortening:** Submit a long URL to receive a shortened, easy-to-share link.
* **URL Redirection:** Accessing a shortened link redirects the user to the original destination URL.
* **Fully Serverless:** No servers to provision or manage. The architecture has zero cost when not in use.
* **Scalable:** Built on services that automatically scale to handle virtually any amount of traffic.

---

## Technology Stack

* **Compute:** AWS Lambda
* **Storage:** Amazon S3, Amazon DynamoDB
* **Networking & Content Delivery:** Amazon CloudFront, Amazon API Gateway
* **DNS & Certificates:** Amazon Route 53, AWS Certificate Manager (ACM)
* **Security & Permissions:** AWS IAM (Identity & Access Management)
* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Backend:** Node.js 18.x

---

## Setup and Deployment

This project was deployed manually using the AWS Management Console to gain a foundational understanding of each service's configuration. The key steps included:
1.  Hosting the static frontend files in an S3 bucket.
2.  Creating Lambda functions for the backend logic.
3.  Setting up a DynamoDB table for data persistence.
4.  Configuring API Gateway as the interface to the Lambda functions.
5.  Creating a single CloudFront distribution with multiple origins (S3 and API Gateway) and path-based behaviors to route traffic appropriately.
6.  Using Route 53 to point a custom domain to the CloudFront distribution.

---

## Challenges & Learnings

This project provided several valuable learning experiences:

* **CloudFront Behavior Routing:** A key challenge was configuring a single CloudFront distribution to serve both a static S3 website and an API Gateway backend. This was solved by creating specific behaviors for API paths (`/shorten`, `???????`) that route to an API Gateway origin, while a default behavior (`*`) routes all other traffic to the S3 origin.
* **Browser-Specific Errors:** I encountered a `net::ERR_BLOCKED_BY_ADMINISTRATOR` error in one browser, which was traced back to a browser extension blocking the generic CloudFront URL. This was ultimately solved by implementing a custom domain, which is a best practice and reinforces the professional appearance of the application.
* **Case-Sensitivity:** I learned firsthand that DynamoDB attribute names are case-sensitive, which was discovered when a `ValidationException` was thrown because the Lambda code's key (`shortId`) did not exactly match the table's partition key during an early iteration.
