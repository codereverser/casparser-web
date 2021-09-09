# CASParser Demo

API Demo for [casparser](https://github.com/codereverser/casparser)

⭐ **Demo** :- https://cas.atomcoder.com  


now includes support for capital gains computation

**Summary**
![image](https://user-images.githubusercontent.com/8553055/124628228-e483b280-de9d-11eb-9634-0d78783bf071.png)

**Detailed** 
![cg-detailed](https://user-images.githubusercontent.com/8553055/124628645-4e9c5780-de9e-11eb-9258-5b228282b74a.jpg)



## Dependencies
- backend
  - python >= 3.8
- frontend
  - node >= 12

## Setup

### Backend
1. Setup python virtualenv and install dependencies

```
python3 -m venv venv
source venv/bin/activate
pip3 install -U setuptools wheel pip
pip3 install -r requirements.txt
```

2. Setup .env (Optional)

Copy `env.example` to .env and update values as required. This step is optional 
and probably would be required only for production deployments

3. Deploy API
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
