import { createServer } from 'node:http';

const body = JSON.stringify('helloworld');

export function createApp() {
  return createServer((_request, response) => {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    });
    response.end(body);
  });
}
