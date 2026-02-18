# Payment Flow System (Node.js & Postgres)

A robust backend implementation of a full card payment flow using Node.js, Sequelize, and PostgreSQL. Designed to be resilient against crashes, network retries, and duplicate events.

## Key Features

* **Idempotency:** Safe retries for payment creation using unique idempotency keys.
* **Transactional Integrity:** Atomic operations for webhooks (Payment update + Ledger posting + Outbox recording) in a single DB transaction.
* **Outbox Pattern:** Guaranteed side-effects (e.g., sending receipts) even if the main service crashes.
* **Webhook Resilience:** * **Signature Verification:** HMAC-SHA256 signature checking.
    * **Deduplication:** Prevents processing the same event multiple times.
    * **Out-of-Order Safety:** Protects against state downgrades (e.g., prevents `FAILED` after `CAPTURED`).
* **Dockerized Environment:** One-command setup with PostgreSQL, and separate background worker.

## System Architecture

The system consists of:
1.  **API Service:** Handles payments, status checks, and webhooks.
2.  **Background Worker:** Processes the Outbox table to handle side-effects asynchronously.
3.  **Mock Gateway:** Simulates an external payment provider with a checkout UI.
4.  **Database:** PostgreSQL for persistent storage and transactional safety.

## 🛠 Prerequisites

* curl
* docker
* docker compose
* nodejs v20

## Getting Started

1.  **Clone the repository.**
    ```shell
    git clone http://github.com/FatmaMahmoud698/payment-flow
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    This will start the API on port `8085` and the Mock Gateway on port `4000`.

## Documentation

- [Postman collection](https://documenter.getpostman.com/view/14349060/2sBXcDH22y#73603169-552e-4dca-a446-18b1ea9fb765)

## Teardown Network

to stop and remove all running containers with volumes

```shell
  docker-compose down -v
```

- to remove all images 

```shell
  docker rm -f $(docker ps -aq)
```

