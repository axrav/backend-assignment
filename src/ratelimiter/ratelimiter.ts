import axios from "axios";

const RATE_LIMIT = 60; // 60 requests per minute
const requestQueue: any[] = [];
let requestsMade = 0;

const rateLimiter = async (requestFn: () => Promise<any>) => {
  if (requestsMade < RATE_LIMIT) {
    requestsMade++;
    return requestFn();
  } else {
    return new Promise((resolve) => requestQueue.push({ resolve, requestFn }));
  }
};

const releaseSlot = () => {
  requestsMade--;
  if (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    nextRequest.resolve(nextRequest.requestFn());
  }
};

export { rateLimiter, releaseSlot };
