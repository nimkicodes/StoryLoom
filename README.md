# StoryLoom

## Instructions to Run StoryLoom

To get StoryLoom up and running on your local machine, follow these steps:

1.  **Unzip the project:**
    ```bash
    unzip StoryLoom
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd StoryLoom
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the server first before the dev:**
    ```bash
    npm run start:server
    ```
5.  **Start npm dev:**
    ```bash
    npm run dev
    ```
The project should be up and running in your browser (preferably the most updated version of Google Chrome) at localhost. 

**Note:** 
Sometimes, it is possible that ports can have other processes running. Please make sure to kill those processes first before you run the project. A basic check can be followed like this, 
```bash
    lsof -i :3000
```
If any processes are running, those will be listed with their PID after this command. You need to kill them first. Let's say, there is a process with PID 455555, so, the next command would look like,
```bash
    kill -9 455555 
```
General Format:
```bash
    kill -9 PID_OF_THE_LISTED_PROCESS 
```
After these steps, there should not be any problem. If there are still issues, let us know. Thank you. 

