# Powerpulse Analytics Dashboard

This project analyzes electricity consumption patterns across Indian states from January 2019 to December 2020, including the COVID-19 lockdown period (March–June 2020). The dataset provides state-wise insights into electricity usage and helps understand regional and national energy consumption trends.

## Features

- **Data Preprocessing Pipeline:** Uses Python and Pandas to clean raw consumption data, map regions, and compute aggregate metrics (monthly trends, national consumption, recovery percentage).
- **Backend API:** A Flask-based RESTful API that serves the processed dataset to the frontend.
- **Interactive Dashboard:** A modern, responsive React frontend (built with Vite) featuring interactive data visualizations (Recharts) and smooth UI animations (Framer Motion).
- **Concurrent Execution:** Easily launch both the frontend and backend development servers simultaneously using a single command.

## Tech Stack

- **Frontend:** React 19, Vite, Recharts (for analytics charts), Framer Motion.
- **Backend:** Python 3, Flask, Flask-CORS.
- **Data Processing:** Pandas.
- **Runner Strategy:** Node.js, `concurrently`.

## Project Structure

```text
├── backend/
│   ├── app.py              # Flask API server
│   ├── preprocess.py       # Data cleaning and aggregation script
│   └── requirements.txt    # Python dependencies
├── dashboard/
│   └── index.html          # Static entry/prototype for the dashboard
├── data/
│   ├── Consumption.csv     # Raw dataset
│   └── *.json              # Processed data files consumed by the API
├── frontend/
│   ├── src/                # React source code components
│   └── package.json        # Frontend dependencies
└── package.json            # Root configuration for concurrent execution
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3.8+](https://www.python.org/)

### Installation

From the root directory of the project, run:

```bash
npm install
```

*(This triggers the `postinstall` script, which automatically installs both frontend npm packages and backend Python requirements from `requirements.txt`).*

### Data Preprocessing

The project comes with preprocessed data, but if you update the raw `Consumption.csv` data, you can re-run the pipeline:

```bash
cd backend
python3 preprocess.py
cd ..
```

### Running the Application

To start both the frontend development server and the backend API server concurrently, simply run from the root directory:

```bash
npm start
```

- **Frontend Development Server:** typically accessible at `http://localhost:5173`
- **Backend API Server:** running at `http://localhost:5000`

## API Endpoints

The Flask backend exposes the following endpoints:

- `GET /api/trends`: Provides regional monthly consumption data.
- `GET /api/national`: Provides national monthly usage totals.
- `GET /api/recovery_pct`: Provides recovery percentage changes comparing Jul-Dec 2020 to 2019.
- `GET /api/stats`: Provides summary statistics including overall total, peak, and average usage across the dataset.
