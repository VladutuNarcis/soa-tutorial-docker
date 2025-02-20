# Containizing a Small React App and JS Backend with Docker

## 1. Introduction

Containerization simplifies development, testing and deployment by encapsulating your application and its environment into lightweight, portable containers. In this tutorial, you’ll learn how to create Docker images for a basic React front-end and a JavaScript (Node.js) backend. We’ll then orchestrate both containers using Docker Compose. By the end of this guide, you will have a fully containerized application that you can run on any system with Docker installed.

## 2. Overview of the Project

The repository structure for our example is organized as follows:

```
tutorial-soa
│   README.md
│   docker-compose.yml    
│   .gitignore
└───backend
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │   server.json
│   
└───folder2
│   │   Dockerfile
│   │   package-lock.json
│   │   package.json
│   │
│   └───public
│   │   │   index.html
│   │
│   └───src
│       │   App.js
│       │   index.js
```

## 3. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Git:** To clone the repository.
- **Docker:** For building and running containers.
- **Docker Compose:** Typically bundled with Docker Desktop or available separately on Linux.

To check your installations, run:

```bash
git --version
docker --version
docker-compose --version
```

Clone the repository using:

```bash
git clone https://github.com/VladutuNarcis/soa-tutorial-docker
cd soa-tutorial-docker
```

## 4. Dockerizing the React Frontend
### 4.1 Creating the Dockerfile for React
Inside the frontend/ directory, create a Dockerfile with the following instructions:

```dockerfile
# Stage 1: Build the React app
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the build with a lightweight web server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Explanation:

- Multi-stage Build: The first stage uses Node.js to install dependencies and build the React app. The second stage copies the build output into an Nginx container for efficient static file serving.
- Optimization: This approach reduces the final image size by not including development dependencies in the final container.

### 4.2 Building and Running the Frontend Container
From the frontend/ directory, build the Docker image:

```bash
docker build -t react-frontend .
```

Then run the container locally to test:

```bash
docker run -p 3000:80 react-frontend
```

Now, open your browser at http://localhost:3000 to view the React application.

## 5. Dockerizing the Node.js Backend
### 5.1 Creating the Dockerfile for the Backend

Within the backend/ directory, create a Dockerfile to containerize the backend service:

```dockerfile
FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Explanation:
- Base Image: Uses a lightweight Node.js image.
- Working Directory: Sets /usr/src/app as the working directory.
- Installation and Copy: Installs dependencies and copies the backend code.
- Port Exposure: Exposes port 5000 for incoming requests.
- Start Command: Runs the Node.js server using server.js.

### 5.2 Building and Running the Backend Container
From the backend/ directory, build the Docker image:

```bash
docker build -t js-backend .
```
Test the container by running:

```bash
docker run -p 5000:5000 js-backend
```

Your backend API should now be available at http://localhost:5000.

## 6. Orchestrating with Docker Compose
### 6.1 Creating docker-compose.yml
To run both containers simultaneously and allow them to communicate, create a docker-compose.yml file in the repository’s root:

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
```
Explanation:
- Services: Defines two services: frontend and backend.
- Build Context: Each service’s build context points to its respective folder.
- Port Mapping: Maps container ports to local machine ports.
- Dependency: The frontend service waits for the backend to start with depends_on.

### 6.2 Running the Entire Application
From the project root, start the services using Docker Compose:

```bash
docker-compose up --build
```

You should see logs for both services. Visit http://localhost:3000 for the React app; it can communicate with the backend at http://backend:5000 (within the Docker network). 

## 7. Testing and Debugging
### 7.1 Verifying Service Connectivity
1. Frontend: Open your browser at http://localhost:3000. Use the browser’s developer tools to ensure that any API calls are correctly resolving to the backend service.

2. Backend: Access http://localhost:5000 directly or use tools like Postman or curl to test API endpoints.

### 7.2 Logs and Container Management
- Logs: Use docker-compose logs -f to tail logs from all services.
- Restarting: If changes are made, rebuild with docker-compose up --build.
- Stopping Containers: Use docker-compose down to stop and remove containers.

## Conclusion
Containerizing your applications with Docker not only simplifies deployment but also ensures that your application behaves consistently across different environments. In this tutorial, you learned how to:

- Set up Dockerfiles for both a React frontend and a Node.js backend.
- Build and run each container individually.
- Use Docker Compose to orchestrate multiple services.