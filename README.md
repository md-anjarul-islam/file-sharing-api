# File Sharing API Server

## Overview

This is a **File Sharing API Server** built with Node.js and Express that allows secure file upload, download, and deletion using key pairs. The API includes features like daily upload/download limits and automatic cleanup of inactive files.

## Features

- File Upload, Download, and Deletion using public/private key pairs.
- Daily upload/download limits per IP address.
- File cleanup after a configurable period of inactivity.
- Extensible to support multiple storage providers (local/cloud).

## Prerequisites

- **Node.js** (v20+)
- **yarn** (v1.22+)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/md-anjarul-islam/file-sharing-api.git
cd file-sharing-api
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Environment setup

Create a `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Adjust the environment variables if needed.

### 4. Run the server

```bash
yarn start
```

This will start the server on the port specified in your `.env` file (default is `3000`).

### 5. Access the API documentation

Swagger UI is available for testing and exploring the API. Once the server is running, visit:

```
http://localhost:3000/api-docs
```

### 6. Running Tests

To run the unit and integration tests:

```bash
yarn test
```

## Storage Providers

The project currently uses local file storage but can be extended to support cloud storage providers like AWS S3, Google Cloud, or Azure Blob. To do so, it needs to implement a new class for the desired provider following the `BaseFileStorage` interface and to configure it in the application.
