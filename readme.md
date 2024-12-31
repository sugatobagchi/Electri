## Aim

To take an image input and detect if it's a 4-wheeler EV vehicle or not.

## Components

It consists of two main components:

1. **Frontend:** Built using [Next.js](https://nextjs.org/).

2. **Backend:** Built using [FastAPI](https://fastapi.tiangolo.com/).


## Setup

### Download Model

- **Download the model from [here](https://drive.google.com/drive/folders/1iT8zPK7s4eySwv4ovzBFMSES0tNE52z9?usp=sharing) and place it in the `backend` directory.**
Without it the backend will not work.

### Frontend

- **Open a terminal and navigate to the frontend directory:**
  ```bash
  cd frontend
  ```

- **Install dependencies:**
  ```bash
  npm install
  ```
- **Run in development mode:**
  ```bash
  npm run dev
  ```

### Backend

- **Open another terminal and navigate to the backend directory:**
  ```bash
  cd backend
  ```

- **Create a virtual environment and activate it:**
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  ```
- **Install dependencies:**
  ```bash
  pip install -r requirements.txt
  ```
- **Run the development server:**
  ```bash
  uvicorn main:app --reload
  ```

The server will be available at `http://127.0.0.1:8000`.


## Usage

- **Open the browser and navigate to `http://localhost:3000`.**
- **Upload an image and click on the `Submit` button.**

## Video

A video demonstration of the project is available [here](https://drive.google.com/file/d/1zo88HHezHUK1AY5kUSCTkNI9geCK0HsT/view?usp=sharing)
