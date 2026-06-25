export interface CodeSnippet {
  language: string;
  code: string;
}

export const codeSnippets: CodeSnippet[] = [
  {
    language: 'python',
    code: `def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    if n == 1:
        return [0]
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i - 1] + fib[i - 2])
    return fib

def main():
    n = 20
    result = fibonacci(n)
    print(f"First {n} Fibonacci numbers: {result}")
    for i in range(2, len(result)):
        ratio = result[i] / result[i - 1]
        print(f"  F({i+1})/F({i}) = {ratio:.6f}")

if __name__ == "__main__":
    main()`,
  },
  {
    language: 'python',
    code: `import asyncio
from dataclasses import dataclass
from typing import AsyncGenerator

@dataclass
class Task:
    name: str
    duration: float

async def worker(task: Task) -> str:
    print(f"Starting task: {task.name}")
    await asyncio.sleep(task.duration)
    return f"Completed: {task.name}"

async def task_generator() -> AsyncGenerator[Task, None]:
    tasks = [
        Task("load data", 0.5),
        Task("process batch", 1.2),
        Task("save results", 0.3),
        Task("send notification", 0.8),
    ]
    for t in tasks:
        yield t
        await asyncio.sleep(0.1)

async def main():
    async for task in task_generator():
        result = await worker(task)
        print(result)

asyncio.run(main())`,
  },
  {
    language: 'javascript',
    code: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event))
      this.events.set(event, []);
    this.events.get(event).push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return;
    for (const listener of listeners)
      listener(...args);
  }
}

const bus = new EventEmitter();
const unsub = bus.on('message', (msg) => {
  console.log(\`Received: \${msg}\`);
});
bus.emit('message', 'Hello, world!');
unsub();`,
  },
  {
    language: 'javascript',
    code: `async function fetchWithRetry(url, options = {}) {
  const { retries = 3, delay = 1000, backoff = 2 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      const wait = delay * Math.pow(backoff, attempt);
      console.warn(\`Attempt \${attempt+1} failed, retry in \${wait}ms\`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

fetchWithRetry('https://api.example.com/data', { retries: 5 })
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Failed:', e));`,
  },
  {
    language: 'rust',
    code: `use std::collections::HashMap;
use std::time::Instant;

struct Cache<T> {
  store: HashMap<String, (T, Instant)>,
  ttl_secs: u64,
}

impl<T: Clone> Cache<T> {
  fn new(ttl_secs: u64) -> Self {
    Cache { store: HashMap::new(), ttl_secs }
  }

  fn get(&self, key: &str) -> Option<&T> {
    self.store.get(key).and_then(|(v, t)| {
      if t.elapsed().as_secs() < self.ttl_secs { Some(v) } else { None }
    })
  }

  fn set(&mut self, key: String, val: T) {
    self.store.insert(key, (val, Instant::now()));
  }
}

fn main() {
  let mut cache: Cache<String> = Cache::new(10);
  cache.set("greeting".into(), "Hello!".into());
  println!("{:?}", cache.get("greeting"));
}`,
  },
  {
    language: 'typescript',
    code: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise<User>;
}

function assertUser(obj: unknown): asserts obj is User {
  if (typeof obj !== 'object' || obj === null)
    throw new Error('not an object');
  if (!('id' in obj) || !('name' in obj))
    throw new Error('missing fields');
}

async function getDisplayName(id: string): Promise<string> {
  const user = await fetchUser(id);
  return \`\${user.name} (\${user.role})\`;
}`,
  },
  {
    language: 'json',
    code: `{
  "project": "tps-visualizer",
  "version": "1.0.0",
  "features": {
    "streaming": true,
    "compare": true,
    "themes": ["light", "dark"],
    "modes": ["code", "text"]
  },
  "presets": [10, 50, 100, 500, 1000],
  "dependencies": {
    "react": "^19.0.0",
    "gpt-tokenizer": "^3.0.0",
    "highlight.js": "^11.0.0"
  },
  "license": "MIT"
}`,
  },
  {
    language: 'python',
    code: `import asyncio
import json
import logging
import time
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import Any, Callable, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"

@dataclass
class Request:
    method: HttpMethod
    path: str
    headers: dict[str, str] = field(default_factory=dict)
    body: Optional[dict[str, Any]] = None
    query: dict[str, str] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)

    @classmethod
    def parse(cls, raw: str) -> "Request":
        lines = raw.strip().split("\\n")
        start_line = lines[0].split()
        method = HttpMethod(start_line[0])
        path_parts = start_line[1].split("?")
        path = path_parts[0]
        query = {}
        if len(path_parts) > 1:
            for pair in path_parts[1].split("&"):
                k, _, v = pair.partition("=")
                query[k] = v
        headers = {}
        for line in lines[1:]:
            if not line.strip():
                break
            k, _, v = line.partition(":")
            headers[k.strip()] = v.strip()
        body = None
        body_start = raw.find("\\n\\n")
        if body_start != -1:
            try:
                body = json.loads(raw[body_start + 2:])
            except json.JSONDecodeError:
                body = None
        return cls(method=method, path=path, headers=headers, body=body, query=query)

@dataclass
class Response:
    status: int = 200
    body: Any = None
    headers: dict[str, str] = field(default_factory=lambda: {"Content-Type": "application/json"})

    def json(self) -> str:
        self.headers["Content-Type"] = "application/json"
        return json.dumps({"status": self.status, "data": self.body})

    def html(self, content: str) -> str:
        self.headers["Content-Type"] = "text/html"
        self.body = content
        return content

class Router:
    def __init__(self):
        self.routes: dict[tuple[HttpMethod, str], Callable] = {}

    def get(self, path: str):
        def wrapper(fn: Callable) -> Callable:
            self.routes[(HttpMethod.GET, path)] = fn
            return fn
        return wrapper

    def post(self, path: str):
        def wrapper(fn: Callable) -> Callable:
            self.routes[(HttpMethod.POST, path)] = fn
            return fn
        return wrapper

    def delete(self, path: str):
        def wrapper(fn: Callable) -> Callable:
            self.routes[(HttpMethod.DELETE, path)] = fn
            return fn
        return wrapper

    def resolve(self, request: Request) -> Optional[Callable]:
        key = (request.method, request.path)
        if key in self.routes:
            return self.routes[key]
        for (method, pattern), handler in self.routes.items():
            if method != request.method:
                continue
            parts = pattern.strip("/").split("/")
            req_parts = request.path.strip("/").split("/")
            if len(parts) != len(req_parts):
                continue
            match = True
            params = {}
            for p, r in zip(parts, req_parts):
                if p.startswith(":"):
                    params[p[1:]] = r
                elif p != r:
                    match = False
                    break
            if match:
                request.path_params = params
                return handler
        return None

class MiddlewareChain:
    def __init__(self):
        self.middlewares: list[Callable] = []

    def use(self, middleware: Callable):
        self.middlewares.append(middleware)

    async def run(self, request: Request, handler: Callable) -> Response:
        async def exec(idx: int) -> Response:
            if idx < len(self.middlewares):
                return await self.middlewares[idx](request, lambda: exec(idx + 1))
            return await handler(request)
        return await exec(0)

class Server:
    def __init__(self, host: str = "0.0.0.0", port: int = 3000):
        self.host = host
        self.port = port
        self.router = Router()
        self.middleware = MiddlewareChain()
        self.running = False

    def use(self, middleware: Callable):
        self.middleware.use(middleware)

    def get(self, path: str):
        return self.router.get(path)

    def post(self, path: str):
        return self.router.post(path)

    def delete(self, path: str):
        return self.router.delete(path)

    async def handle_connection(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        try:
            data = await reader.read(65536)
            raw = data.decode("utf-8")
            request = Request.parse(raw)
            handler = self.router.resolve(request)
            if handler is None:
                response = Response(status=404, body={"error": "not found"})
            else:
                response = await self.middleware.run(request, handler)
            encoded = response.json().encode("utf-8")
            status_line = f"HTTP/1.1 {response.status} OK\\r\\n"
            headers = "\\r\\n".join(f"{k}: {v}" for k, v in response.headers.items())
            writer.write(f"{status_line}{headers}\\r\\n\\r\\n{encoded.decode()}".encode("utf-8"))
        except Exception as e:
            logger.error(f"Error handling request: {e}")
            writer.write(b"HTTP/1.1 500 Internal Server Error\\r\\n\\r\\n")
        finally:
            await writer.drain()
            writer.close()

    async def start(self):
        self.running = True
        server = await asyncio.start_server(self.handle_connection, self.host, self.port)
        logger.info(f"Server listening on {self.host}:{self.port}")
        async with server:
            await server.serve_forever()

    def stop(self):
        self.running = False
        logger.info("Server stopped")

async def logging_middleware(request: Request, next_fn: Callable) -> Response:
    logger.info(f"{request.method.value} {request.path}")
    start = time.time()
    response = await next_fn()
    elapsed = (time.time() - start) * 1000
    logger.info(f"{request.method.value} {request.path} -> {response.status} ({elapsed:.1f}ms)")
    return response

async def main():
    app = Server(port=8080)
    app.use(logging_middleware)

    @app.get("/")
    async def home(request: Request) -> Response:
        return Response(body={"message": "welcome", "version": "1.0"})

    @app.get("/health")
    async def health(request: Request) -> Response:
        return Response(body={"status": "ok", "uptime": time.time()})

    @app.get("/users/:id")
    async def get_user(request: Request) -> Response:
        user_id = request.path_params.get("id", "unknown")
        return Response(body={"id": user_id, "name": f"User {user_id}", "role": "viewer"})

    @app.post("/users")
    async def create_user(request: Request) -> Response:
        return Response(status=201, body={"created": True, "data": request.body})

    await app.start()

if __name__ == "__main__":
    asyncio.run(main())`,
  },
  {
    language: 'typescript',
    code: `import { createHash, randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

interface UserSession {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  data: Record<string, unknown>;
}

interface AuthToken {
  token: string;
  userId: string;
  scopes: string[];
  issuedAt: number;
}

type Middleware = (req: Request, next: () => Promise<Response>) => Promise<Response>;

class SessionStore {
  private sessions = new Map<string, UserSession>();

  create(userId: string, ttlMs = 3600000): UserSession {
    const id = randomBytes(32).toString('hex');
    const now = Date.now();
    const session: UserSession = {
      id, userId, createdAt: now,
      expiresAt: now + ttlMs, data: {},
    };
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): UserSession | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(id);
      return undefined;
    }
    return session;
  }

  delete(id: string): void {
    this.sessions.delete(id);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now > session.expiresAt) this.sessions.delete(id);
    }
  }
}

class RateLimiter {
  private hits = new Map<string, number[]>();
  private limit: number;
  private windowMs: number;

  constructor(limit = 100, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const window = this.hits.get(key) || [];
    const recent = window.filter(t => now - t < this.windowMs);
    if (recent.length >= this.limit) return false;
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }

  reset(key: string): void {
    this.hits.delete(key);
  }
}

class Logger {
  private levels = ['debug', 'info', 'warn', 'error'] as const;
  private currentLevel = 1;

  setLevel(level: typeof this.levels[number]): void {
    const idx = this.levels.indexOf(level);
    if (idx !== -1) this.currentLevel = idx;
  }

  private log(level: number, msg: string, data?: unknown): void {
    if (level < this.currentLevel) return;
    const ts = new Date().toISOString();
    const line = \`[\${ts}] [\${this.levels[level].toUpperCase()}] \${msg}\`;
    if (data) {
      console.log(line, JSON.stringify(data, null, 2));
    } else {
      console.log(line);
    }
  }

  debug(msg: string, data?: unknown): void { this.log(0, msg, data); }
  info(msg: string, data?: unknown): void { this.log(1, msg, data); }
  warn(msg: string, data?: unknown): void { this.log(2, msg, data); }
  error(msg: string, data?: unknown): void { this.log(3, msg, data); }
}

class Config {
  private config: Record<string, string> = {};

  load(env: Record<string, string | undefined>): void {
    this.config = {
      PORT: env.PORT || '3000',
      HOST: env.HOST || '0.0.0.0',
      DB_URL: env.DB_URL || 'postgres://localhost:5432/app',
      REDIS_URL: env.REDIS_URL || 'redis://localhost:6379',
      LOG_LEVEL: env.LOG_LEVEL || 'info',
      SECRET: env.SECRET || randomBytes(16).toString('hex'),
    };
  }

  get(key: string, fallback = ''): string {
    return this.config[key] || fallback;
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return \`\${salt}:\${hash}\`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const computed = createHash('sha256').update(salt + password).digest('hex');
  return computed === hash;
}

const logger = new Logger();
const config = new Config();
const sessions = new SessionStore();
const rateLimiter = new RateLimiter();

config.load(process.env);

async function authMiddleware(req: Request, next: () => Promise<Response>): Promise<Response> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  const session = sessions.get(token);
  if (!session) {
    return new Response(JSON.stringify({ error: 'session expired' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  return next();
}

async function loggingMiddleware(req: Request, next: () => Promise<Response>): Promise<Response> {
  const start = Date.now();
  logger.info(\`\${req.method} \${req.url}\`);
  const res = await next();
  const ms = Date.now() - start;
  logger.info(\`\${req.method} \${req.url} -> \${res.status} (\${ms}ms)\`);
  return res;
}

async function rateLimitMiddleware(req: Request, next: () => Promise<Response>): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimiter.check(ip)) {
    return new Response(JSON.stringify({ error: 'rate limited' }), {
      status: 429, headers: { 'Content-Type': 'application/json' },
    });
  }
  return next();
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const middlewares: Middleware[] = [
  loggingMiddleware,
  rateLimitMiddleware,
];

async function handleRequest(req: Request): Promise<Response> {
  const chain = async (idx: number): Promise<Response> => {
    if (idx < middlewares.length) {
      return middlewares[idx](req, () => chain(idx + 1));
    }
    const url = new URL(req.url);

    if (url.pathname === '/health' && req.method === 'GET') {
      return json({ status: 'ok', uptime: process.uptime() });
    }

    if (url.pathname === '/auth/login' && req.method === 'POST') {
      const body = await req.json() as { userId: string };
      const session = sessions.create(body.userId);
      return json({ token: session.id, expiresAt: session.expiresAt });
    }

    if (url.pathname === '/auth/logout' && req.method === 'POST') {
      return json({ ok: true });
    }

    return json({ error: 'not found' }, 404);
  };

  return chain(0);
}

const server = Bun.serve({
  port: parseInt(config.get('PORT')),
  fetch: handleRequest,
});

logger.info(\`Server running on http://localhost:\${config.get('PORT')}\`);

setInterval(() => sessions.cleanup(), 60000);
setInterval(() => rateLimiter.reset('*'), 60000);`,
  },
];
