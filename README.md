# CASParser Demo

API Demo for [casparser](https://github.com/codereverser/casparser)

## Dependencies
- backend
  - python > 3.8
- frontend
  - node > 12

## Setup

### Backend
1. Setup python virtualenv and install dependencies

```
python3 -m venv venv
source venv/bin/activate
pip3 install -U setuptools wheel pip
pip3 install -r requirements.txt
```
2. Deploy API
```
uvicorn app:app --reload
```

### Frontend
1. Install dependencies
```
npm install
```
2. Run frontend
```
npm run dev
```
