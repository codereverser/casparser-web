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
  - python >= 3.13
  - [uv](https://docs.astral.sh/uv/)
- frontend
  - node >= 20

## Setup

### Backend
1. Install dependencies

```
uv sync
```

2. Setup .env (Optional)

Copy `env.example` to .env and update values as required. This step is optional 
and probably would be required only for production deployments

3. Deploy API
```
uv run uvicorn app:app --reload
```

### Frontend (development)
1. Install dependencies
```
npm install
```
2. Run frontend
```
npm run dev
```
