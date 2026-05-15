# TaskHub — Backend API

REST API for TaskHub — a collaborative task management platform. Built with Express, Prisma, and PostgreSQL.

**Live:** [taskhub-api.thecraftlabs.xyz](https://taskhub-api.thecraftlabs.xyz)

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Language | TypeScript 6 |
| ORM | Prisma 6 |
| Database | PostgreSQL (via Supabase) |
| Auth | JWT + HTTP-only cookies |
| Password Hashing | bcrypt |
| Validation | Zod 4 |
| Dev Server | ts-node-dev |

---

## Architecture

The server follows a clean **controllers → services → repositories** layered architecture. Each feature domain is encapsulated in its own module under `src/modules/`.

```
src/
├── app.ts              # Express app setup, middleware, route registration
├── server.ts           # HTTP server bootstrap (port binding)
├── modules/
│   ├── auth/
│   │   ├── controller.ts    # Parse request, call service, set cookie, respond
│   │   ├── service.ts       # Business logic (hash, token, validation guards)
│   │   ├── repository.ts    # Prisma queries (findUserByEmail, createUser, etc.)
│   │   ├── routes.ts        # Route definitions for /api/v1/auth
│   │   └── validation.ts    # Zod schemas (signupSchema, loginSchema)
│   ├── projects/
│   │   ├── controller.ts
│   │   ├── service.ts       # Enforces ownership before member operations
│   │   ├── repository.ts
│   │   ├── routes.ts
│   │   └── validation.ts
│   ├── tasks/
│   │   ├── controller.ts
│   │   ├── service.ts       # Calls activity.service after mutations
│   │   ├── repository.ts
│   │   ├── routes.ts
│   │   └── validation.ts
│   ├── users/
│   │   ├── controller.ts    # Username search
│   │   ├── repository.ts
│   │   └── routes.ts
│   └── activity/
│       ├── controller.ts
│       ├── service.ts
│       ├── repository.ts
│       └── routes.ts
└── shared/
    ├── middleware/
    │   └── auth.middleware.ts   # JWT verification, attaches req.user
    ├── services/
    │   └── activity.service.ts  # Shared createActivity helper
    ├── utils/
    │   ├── hash.ts              # bcrypt helpers (hashPassword, comparePassword)
    │   ├── jwt.ts               # generateToken helper
    │   └── project-permissions.ts  # requireProjectMember / requireProjectOwner
    ├── prisma/
    │   └── prisma.ts            # Singleton PrismaClient instance
    └── types/                   # Express Request type augmentation (req.user)
```

---

## Database Schema

Five models cover the full domain:

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  username     String   @unique
  email        String   @unique
  passwordHash String
  avatarUrl    String?

  ownedProjects      Project[]      @relation("ProjectOwner")
  projectMemberships ProjectMember[]
  assignedTasks      Task[]         @relation("AssignedTasks")
  createdTasks       Task[]         @relation("CreatedTasks")
  activities         ActivityLog[]
}

enum ProjectRole { OWNER  MEMBER }

model Project {
  id          String
  name        String
  description String?
  ownerId     String
  members     ProjectMember[]
  tasks       Task[]
  activities  ActivityLog[]
}

model ProjectMember {
  projectId String
  userId    String
  role      ProjectRole @default(MEMBER)
  @@unique([projectId, userId])
}

enum TaskStatus   { TODO  IN_PROGRESS  DONE }
enum TaskPriority { LOW   MEDIUM       HIGH }

model Task {
  id             String
  title          String
  description    String?
  status         TaskStatus    @default(TODO)
  priority       TaskPriority  @default(MEDIUM)
  dueDate        DateTime?
  projectId      String
  assignedUserId String?
  createdById    String
  activities     ActivityLog[]
}

enum ActivityType {
  PROJECT_CREATED  MEMBER_ADDED
  TASK_CREATED     TASK_UPDATED
  TASK_STATUS_UPDATED  TASK_DELETED
}

model ActivityLog {
  id        String
  type      ActivityType
  message   String
  projectId String
  userId    String
  taskId    String?
  createdAt DateTime @default(now())
}
```

All primary keys use `cuid()`. `ProjectMember` has a composite unique constraint on `[projectId, userId]` to prevent duplicate memberships.

---

## Authentication Strategy

Auth uses **HTTP-only cookie-based JWT**. On signup or login, a `token` cookie is set on the response with the following options:

```ts
res.cookie('token', result.token, {
  httpOnly: true,
  secure: isProduction,     // only HTTPS in prod
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
});
```

In development, the middleware also accepts a `Bearer` token from the `Authorization` header (for easier API testing). In production, only the cookie is trusted.

The `authMiddleware` decodes the JWT and attaches `req.user = { userId }` to the request object. All protected routes call this middleware before reaching the controller.

Passwords are hashed with bcrypt. The `passwordHash` field is never returned in any response — the service layer destructures it out before returning the user object.

---

## API Routes

### Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | No | Register a new user |
| `POST` | `/login` | No | Authenticate and set cookie |
| `POST` | `/logout` | No | Clear the auth cookie |
| `GET` | `/me` | Yes | Get the current authenticated user |

### Projects — `/api/v1/projects`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Yes | Create a new project |
| `GET` | `/` | Yes | List all projects the user is a member of |
| `GET` | `/:id` | Yes | Get a single project by ID |
| `POST` | `/:id/members` | Yes | Add a member to a project (owner only) |
| `GET` | `/:id/members` | Yes | List all members of a project |

### Tasks — `/api/v1/tasks`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Yes | Create a task |
| `GET` | `/project/:projectId` | Yes | Get all tasks in a project |
| `PATCH` | `/:id/status` | Yes | Update a task's status (for Kanban drag-and-drop) |
| `PATCH` | `/:id` | Yes | Update all task fields |
| `DELETE` | `/:id` | Yes | Delete a task |

### Users — `/api/v1/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/search?username=` | Yes | Search for users by username prefix |

### Activity — `/api/v1/activities`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/project/:projectId` | Yes | Get the activity log for a project |

---

## Authorization Strategy

Authorization is enforced at the service layer, not the route level. Two reusable guards live in `shared/utils/project-permissions.ts`:

- **`requireProjectMember(projectId, userId)`** — throws if the user has no membership in the project. Applied to all read and task mutation operations.
- **`requireProjectOwner(projectId, userId)`** — throws if the user's role is not `OWNER`. Currently applied to adding new project members.

This means even if a route is behind `authMiddleware`, a user cannot access another project's data by guessing its ID — they must be a member.

```ts
// Example from projects service
export const addProjectMemberService = async (
  projectId: string,
  currentUserId: string,
  targetUserId: string
) => {
  await requireProjectOwner(projectId, currentUserId);
  // ... rest of logic
};
```

---

## Validation

Every endpoint that accepts a request body validates it with Zod before the service is called. Schemas are defined in each module's `validation.ts` and reused as TypeScript types via `z.infer<>`.

Example from `tasks/validation.ts`:

```ts
export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  assignedUserId: z.string().optional(),
  projectId: z.string(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
```

Validation errors from Zod (thrown by `.parse()`) are caught in the controller's try/catch and returned as `400` responses with the error message.

---

## Activity Logging

Every significant mutation emits an activity log entry. This is handled by a shared `createActivity()` helper in `shared/services/activity.service.ts`, called at the end of each service function:

| Trigger | `ActivityType` | Example Message |
|---|---|---|
| Project created | `PROJECT_CREATED` | `Created project "Design System"` |
| Member added | `MEMBER_ADDED` | `Added @alice to the project` |
| Task created | `TASK_CREATED` | `Created task "Fix header bug"` |
| Task updated | `TASK_UPDATED` | `Updated task "Fix header bug"` |
| Status changed | `TASK_STATUS_UPDATED` | `Moved task "Fix header bug" to done` |
| Task deleted | `TASK_DELETED` | `Deleted task "Fix header bug"` |

Activity entries store the `userId`, `projectId`, and optionally a `taskId`. The `GET /activities/project/:projectId` endpoint returns them joined with user data (name, avatar) so the frontend can render the timeline.

---

## Modular Pattern

Each module is self-contained:

- **Controller** — Validates request body, extracts `req.user.userId`, calls the appropriate service, returns a typed JSON response.
- **Service** — Contains all business logic: authorization guards, input transformation, and orchestration of repository calls and activity logging.
- **Repository** — Plain Prisma queries. No business logic.
- **Validation** — Zod schemas and inferred TypeScript types.
- **Routes** — Express router, applies `authMiddleware` where needed, connects endpoints to controllers.

This separation keeps controllers thin, services testable in isolation, and repositories replaceable.

---

## Prisma Setup

```bash
# Generate the Prisma client from schema
npx prisma generate

# Create and apply a new migration (development)
npx prisma migrate dev --name <migration_name>

# Apply pending migrations (production / CI)
npx prisma migrate deploy

# Inspect the database with Prisma Studio
npx prisma studio
```

Migrations live in `prisma/migrations/`. The Dockerfile runs `npx prisma migrate deploy` automatically before starting the server.

---

## Environment Variables

Create a `.env` file in the server root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
FRONTEND_ORIGINS="http://localhost:5173,http://localhost:5174"
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `NODE_ENV` | `development` or `production` (affects cookie security and bearer token support) |
| `FRONTEND_ORIGINS` | Comma-separated list of allowed CORS origins |

---

## Local Setup

**Prerequisites:** Node.js 22+

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations against your local database
npx prisma migrate dev

# Start the development server (with hot reload)
npm run dev
```

The server starts on `http://localhost:5000` by default.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with `ts-node-dev` — watches for file changes and restarts |
| `npm run build` | Compile TypeScript to `dist/` via `tsc` |
| `npm start` | Run the compiled `dist/server.js` |

---

## Deployment

The server is containerized with a two-stage Dockerfile:

1. **Builder stage** (`node:22-alpine`) — installs all dependencies (including devDeps for TypeScript), generates the Prisma client, and compiles TypeScript.
2. **Runner stage** — installs only production dependencies, copies the compiled output and Prisma client from the builder stage.

On container start, it runs `npx prisma migrate deploy` to apply any pending migrations before starting the Node.js process:

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
```

```bash
docker build -t taskhub-server .

docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  -e NODE_ENV="production" \
  -e FRONTEND_ORIGINS="https://taskhub.thecraftlabs.xyz" \
  taskhub-server
```

**Production:** [https://taskhub-api.thecraftlabs.xyz](https://taskhub-api.thecraftlabs.xyz)
