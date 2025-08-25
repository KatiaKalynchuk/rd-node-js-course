# Message Brokers

## Project Overview

This project demonstrates an **event-driven architecture** using **NestJS**, **Kafka**, and **Redis**. It implements a basic producer-consumer setup, with retries for failed events via Redis streams.

The main goals are:

* Understand message brokers, Kafka topics, and event-based processing.
* Implement retry mechanisms with Redis streams.
* Build a modular NestJS architecture for event-driven systems.

## Features

* Kafka producer for publishing `UserSignedUp` events.
* Kafka consumer (LoggerService) to process incoming events.
* Retry mechanism: if the consumer fails, events are pushed to a Redis stream (`retries.notifications`) and retried by `RetryWorker`.
* Modular NestJS structure with services, controllers, and modules.

## Tech Stack

* Node.js + TypeScript
* NestJS
* Kafka (`@nestjs/microservices`)
* Redis (`redis` package)

## Modules

### NotificationModule

* **NotificationService**: Publishes `UserSignedUp` events to Kafka.
* **NotificationController**: REST endpoint `POST /signup` for testing event publishing.

### LoggerModule

* **LoggerController**: Listens to Kafka topic `events.notifications`.
* **LoggerService**: Processes events and pushes failed events to Redis.

### RetryWorker

* Reads events from Redis stream and retries processing.

### RedisModule

* Provides Redis client, methods to add retries and read from Redis streams.

## Setup

1. **Install dependencies**

```bash
npm install
```

2. **Start Kafka & Redis**

* Kafka broker: `localhost:9092`
* Redis: `localhost:6379`

3. **Run NestJS app**

```bash
docker-compose up
npm run start:dev
```

## Usage

### Send a test event

```bash
POST /signup
Content-Type: application/json
{
  "id": "u1",
  "email": "test@example.com"
}
```

* This publishes a `UserSignedUp` event to Kafka.

### Kafka Consumer

* LoggerController automatically receives events from `events.notifications`.
* Failed events are stored in Redis for retry.

### Retry Worker

* RetryWorker automatically reads from `retries.notifications` and retries event processing.

## Environment Variables

* `REDIS_URL` - URL for Redis (default `redis://localhost:6379`).

## Notes

* Retry mechanism ensures that no events are lost if consumer crashes.
* Modular architecture separates REST endpoints, Kafka consumer logic, and retry handling.

## License

MIT

