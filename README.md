# CASParser Demo

Web demo for [casparser](https://github.com/codereverser/casparser) - parse
Consolidated Account Statement (CAS) PDF files issued by CAMS, KFintech, NSDL
and CDSL.

⭐ **Demo** :- https://cas.atomcoder.com

## Features

- **Portfolio summary and valuation** - folios, schemes and transactions from
  CAMS / KFintech statements
- **Capital gains report** - FIFO-matched LTCG / STCG per financial year,
  including taxable LTCG (grandfathering and indexation aware). Requires a
  *detailed* statement covering the full investment history (all schemes with
  zero opening balance)
- **Demat holdings** - equities, mutual funds and bonds from NSDL / CDSL
  consolidated statements
- **Data-quality warnings** - parse warnings (e.g. unit-balance checksum
  mismatches) and incomplete-statement notices are surfaced in the UI

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
  - yarn

## Setup

### Backend

1. Install dependencies

```
uv sync
```

2. Setup .env (Optional)

Copy `env.example` to .env and update values as required. This step is optional
and probably would be required only for production deployments

3. Run API

```
uv run uvicorn app:app --reload
```

### Frontend (development)

1. Install dependencies

```
cd ui
yarn install
```

2. Run frontend

```
yarn dev
```

The dev server proxies `/api` to `http://127.0.0.1:8000` (see
`ui/nuxt.config.ts`).
