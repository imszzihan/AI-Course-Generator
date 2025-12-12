import { Course } from '../types';

export const DEMO_COURSE: Course = {
  title: "Modern Full Stack Masterclass: Next.js 14, TypeScript & Cloud",
  certificateTitle: "Certified Full Stack Architect",
  description: "A definitive, university-grade curriculum covering advanced patterns in React Server Components, Database Architecture, Cloud Infrastructure, and Application Security. Designed for developers building production-grade software.",
  targetAudience: "Senior Developers & Architects",
  difficulty: "Advanced",
  estimatedTotalDuration: "40 Hours",
  modules: [
    {
      title: "Module 1: Advanced Next.js Architecture",
      description: "Deep dive into the App Router, Server Actions, and React Server Components (RSC) internals.",
      lessons: [
        {
          title: "Internals of React Server Components",
          duration: "1h 15m",
          content: `### The RSC Paradigm Shift
          
React Server Components (RSC) represent the biggest architectural shift in the React ecosystem since Hooks. Unlike traditional SSR (which hydrates everything on the client), RSCs never hydrate. They run exclusively on the server, generating a serializable protocol that the client reads to construct the Virtual DOM.

#### How the "Payload" Works

When you request a page in Next.js App Router, the server doesn't just send HTML. It sends a mixed stream of HTML (for initial paint) and **RSC Payload**.

\`\`\`json
// Simplified RSC Payload representation
[
  "$", "div", null, {
    "children": [
      ["$", "h1", null, {"children": "Hello World"}],
      ["$", "$L1", null, {}] // Reference to a Client Component
    ]
  }
]
\`\`\`

This payload allows the client to merge new server content without destroying client-side state (like input focus or scroll position).

### Server-Side Rendering vs. RSC

It is crucial to distinguish between SSR and RSC:
*   **SSR**: Generates HTML for initial load. All components still hydrate (download JS) to become interactive.
*   **RSC**: Components run on server. No JS bundle is sent to client for these components.

#### Composition Patterns

To make RSCs effective, you must push "interactivity" to the leaves of your tree.

\`\`\`tsx
// Server Component (Parent)
import { ClientCounter } from './ClientCounter';

export default async function Page() {
  const data = await db.query(); // Direct DB access!
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientCounter initialCount={data.count} />
    </div>
  );
}
\`\`\`
`,
          keyTakeaways: [
            "RSCs reduce bundle size by keeping dependencies on the server.",
            "The RSC Payload allows seamless merging of server content into client state.",
            "Interactivity must be isolated in 'use client' components (leaves of the tree)."
          ],
          assignment: "Refactor a traditional React `useEffect` data fetching component into a React Server Component with a Suspense boundary for loading states.",
          resources: [
            {
              title: "Next.js App Router Documentation",
              url: "https://nextjs.org/docs/app",
              type: "article"
            },
            {
              title: "React Server Components Spec",
              url: "https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md",
              type: "article"
            },
            {
              title: "RSC From Scratch",
              url: "https://github.com/reactwg/server-components/discussions/5",
              type: "video"
            }
          ],
          quiz: [
            {
              question: "What is the primary difference between SSR and RSC?",
              options: [
                "SSR runs on the client, RSC runs on the server.",
                "SSR requires hydration for all components; RSCs do not send JS for server components.",
                "SSR is deprecated in Next.js 14.",
                "There is no difference; they are synonyms."
              ],
              correctAnswerIndex: 1,
              explanation: "The key distinction is that RSCs do not add to the JavaScript bundle size, whereas SSR simply pre-renders HTML but still requires the full JS bundle for hydration."
            },
            {
              question: "Can a Server Component import a Client Component?",
              options: ["Yes", "No", "Only with dynamic imports", "Only in development"],
              correctAnswerIndex: 0,
              explanation: "Yes, this is the standard composition pattern. A Server Component renders a Client Component and passes props (which must be serializable)."
            },
            {
              question: "Can a Client Component import a Server Component?",
              options: ["Yes, directly", "No, not directly", "Yes, but it becomes a Client Component", "Only via Context"],
              correctAnswerIndex: 1,
              explanation: "You cannot import a Server Component into a Client Component directly because the Client Component runs in the browser. You must pass the Server Component as a `children` prop (slot pattern)."
            }
          ]
        },
        {
          title: "Streaming & Suspense Boundaries",
          duration: "55m",
          content: `### Progressive Rendering
          
Web performance is often measured by Time to First Byte (TTFB) and First Contentful Paint (FCP). Traditional SSR waits for *all* data to be fetched before sending *any* HTML. Streaming breaks this limitation.

#### The Waterfalls Problem

If you await multiple data sources sequentially, your user waits for the slowest request.

\`\`\`tsx
// Bad: Sequential Blocking
const user = await getUser();
const posts = await getPosts(); // Waits for user to finish
\`\`\`

#### Using Suspense for Granular Loading

Next.js leverages React Suspense to "stream" HTML chunks. Wrap slow components in \`<Suspense>\`.

\`\`\`tsx
import { Suspense } from 'react';
import { PostList } from './PostList';

export default function Page() {
  return (
    <main>
      <h1>My Blog</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
         <PostList />
      </Suspense>
    </main>
  );
}
\`\`\`

When \`<PostList>\` hits an async operation, React throws a promise. Next.js catches it, sends the \`fallback\` HTML immediately, and keeps the HTTP connection open. When the data resolves, it streams the script to swap the fallback with real content.

### Loading.tsx

The \`loading.tsx\` file in the App Router is simply a wrapper around your page content in a Suspense boundary automatically provided by the framework.`,
          keyTakeaways: [
            "Streaming allows the server to send HTML chunks as they become ready.",
            "Suspense boundaries decouple slow data fetches from the initial UI paint.",
            "Parallel data fetching should be preferred over sequential waterfalls."
          ],
          assignment: "Implement a dashboard with three widgets (User, Analytics, Notifications). Use artificial delays to simulate slow APIs and wrap each in a Suspense boundary to demonstrate independent streaming.",
          resources: [
             {
              title: "React Suspense Docs",
              url: "https://react.dev/reference/react/Suspense",
              type: "article"
            },
            {
              title: "Streaming with Suspense",
              url: "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming",
              type: "video"
            }
          ],
          quiz: [
            {
              question: "What happens to the HTTP connection during streaming?",
              options: ["It closes immediately after the first byte", "It remains open to push subsequent HTML chunks", "It uses WebSockets", "It switches to UDP"],
              correctAnswerIndex: 1,
              explanation: "The connection uses 'Transfer-Encoding: chunked' (or similar mechanisms) to keep the response open, allowing the server to push updates as data resolves."
            },
            {
              question: "What is the specific React mechanism Next.js uses for Streaming?",
              options: ["React.lazy", "React.memo", "React Suspense", "React Context"],
              correctAnswerIndex: 2,
              explanation: "Suspense allows React to 'suspend' rendering while waiting for async operations (like data fetching in RSCs) and show a fallback."
            },
            {
              question: "How does loading.tsx relate to Suspense?",
              options: ["It is a completely different system", "It automatically wraps the page segment in a Suspense boundary", "It replaces the 404 page", "It caches the loading state"],
              correctAnswerIndex: 1,
              explanation: "Next.js automatically wraps the page component in a Suspense boundary and uses the default export of loading.tsx as the fallback."
            }
          ]
        }
      ]
    },
    {
      title: "Module 2: Database Design & ORM Patterns",
      description: "Professional database modeling with PostgreSQL and Prisma/Drizzle.",
      lessons: [
        {
          title: "Relational Modeling with Prisma",
          duration: "1h 30m",
          content: `### Schema Design First
          
In modern full-stack development, the database schema is the source of truth. We use Prisma as an ORM (Object-Relational Mapper) to define our data structure in a human-readable format.

#### One-to-Many & Many-to-Many

Understanding relationships is key.

**One-to-Many (User -> Posts)**
One user can have many posts.
\`\`\`prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
\`\`\`

**Many-to-Many (Post <-> Categories)**
Implicit many-to-many in Prisma simplifies the join table creation.
\`\`\`prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
\`\`\`

### ACID Transactions

When performing complex mutations (e.g., transferring money, creating an order with line items), you must ensure data integrity.

\`\`\`ts
const [order, log] = await prisma.$transaction([
  prisma.order.create({ ... }),
  prisma.auditLog.create({ ... }),
])
\`\`\`

If any part of the transaction fails, all changes are rolled back.`,
          keyTakeaways: [
            "Prisma Schema provides a declarative definition of your database structure.",
            "Always define foreign key constraints explicitly to maintain referential integrity.",
            "Use transactions for operations that modify multiple tables simultaneously."
          ],
          assignment: "Design a schema for an E-commerce platform including Users, Products, Orders, and Reviews. Ensure Orders cannot exist without a valid User.",
          resources: [
            {
              title: "Prisma Schema Reference",
              url: "https://www.prisma.io/docs/concepts/components/prisma-schema",
              type: "article"
            },
            {
              title: "Database Design Fundamentals",
              url: "https://www.postgresql.org/docs/",
              type: "book"
            }
          ],
          quiz: [
            {
              question: "What does ACID stand for in database transactions?",
              options: ["Async, Consistent, Isolated, Durable", "Atomicity, Consistency, Isolation, Durability", "Automated, Cloud, Integrated, Data", "Access, Control, Identity, Design"],
              correctAnswerIndex: 1,
              explanation: "Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (saved permanently) are the pillars of reliable transactions."
            },
            {
              question: "In a Many-to-Many relationship, what is the 'Join Table'?",
              options: ["A table that links two other tables via foreign keys", "A table that joins text strings", "A primary key", "A backup table"],
              correctAnswerIndex: 0,
              explanation: "A join table (or junction table) contains the foreign keys of both related tables to map the relationship between them."
            },
            {
              question: "Why use an ORM like Prisma?",
              options: ["It makes the database faster", "It provides type-safety and auto-completion for queries", "It removes the need for a database", "It encrypts all data"],
              correctAnswerIndex: 1,
              explanation: "The primary benefit is Type Safety (TypeScript integration) and developer experience, preventing invalid queries at compile time."
            }
          ]
        },
        {
          title: "Indexing & Query Performance",
          duration: "1h 00m",
          content: `### The Cost of a Query
          
Database performance is often the bottleneck in web applications. A 'Full Table Scan' occurs when the database must read every single row to find a match. As data grows to millions of rows, this becomes unacceptably slow.

#### Indexes (B-Tree)

An index is a data structure (usually a B-Tree) that improves the speed of data retrieval operations.

\`\`\`sql
CREATE INDEX idx_user_email ON "User" ("email");
\`\`\`

In Prisma:
\`\`\`prisma
model User {
  email String @unique
  @@index([email])
}
\`\`\`

#### The N+1 Problem

This is a common performance pitfall when fetching related data.

**Bad Approach:**
1. Fetch all posts (1 query).
2. For *each* post, fetch the author (N queries).
Total: N+1 queries.

**Optimized Approach (Eager Loading):**
Fetch posts and join the authors in a single query.
\`\`\`ts
const posts = await prisma.post.findMany({
  include: { author: true }
})
\`\`\`

### Analyzing Query Plans

Always use tools like \`EXPLAIN ANALYZE\` (in SQL) or Prisma Studio to understand the cost of your queries.`,
          keyTakeaways: [
            "Indexes dramatically speed up READ operations but slightly slow down WRITE operations.",
            "Avoid N+1 problems by using eager loading (joins) or batching.",
            "Composite indexes are required when querying by multiple fields simultaneously."
          ],
          assignment: "Use Prisma Client to write a query that fetches a user, their last 5 orders, and the products within those orders, all in a single efficient database call.",
          resources: [
            {
              title: "Use The Index, Luke",
              url: "https://use-the-index-luke.com/",
              type: "book"
            },
            {
              title: "PostgreSQL Indexing",
              url: "https://www.postgresql.org/docs/current/indexes.html",
              type: "article"
            }
          ],
          quiz: [
            {
              question: "What is the N+1 problem?",
              options: ["A math error in JavaScript", "Fetching a list of items and then performing a separate query for each item", "An infinite loop", "A security vulnerability"],
              correctAnswerIndex: 1,
              explanation: "It refers to the inefficiency of executing one initial query (1) and then N subsequent queries for each result."
            },
            {
              question: "When should you NOT add an index?",
              options: ["On primary keys", "On columns frequently used in WHERE clauses", "On columns with low cardinality (e.g., boolean) or frequently updated columns", "On foreign keys"],
              correctAnswerIndex: 2,
              explanation: "Indexes add overhead to inserts/updates. If a column is rarely searched or has very few unique values (like is_active), the cost often outweighs the benefit."
            },
            {
              question: "What Prisma method performs a 'Join'?",
              options: ["join()", "merge()", "include: {}", "connect: {}"],
              correctAnswerIndex: 2,
              explanation: "The `include` property in Prisma Client tells the engine to fetch related records, effectively performing a JOIN or efficient parallel fetch."
            }
          ]
        }
      ]
    },
    {
      title: "Module 3: Authentication & Security",
      description: "Implementing Auth.js (NextAuth), RBAC, and securing API routes.",
      lessons: [
        {
          title: "OAuth 2.0 & Session Management",
          duration: "1h 00m",
          content: `### Authentication vs Authorization
          
*   **Authentication (AuthN)**: Who are you? (Login, Identity)
*   **Authorization (AuthZ)**: What are you allowed to do? (Permissions, Roles)

#### JWT vs Database Sessions

**JSON Web Tokens (JWT):**
*   Stateless. The session data is encrypted in the token stored on the client.
*   Pros: Fast, no DB lookup needed for every request.
*   Cons: Hard to revoke immediately (requires short expiry or blacklisting).

**Database Sessions:**
*   Stateful. A session ID is stored in a cookie; data is in the DB.
*   Pros: easy to revoke (delete row).
*   Cons: Database hit on every request.

### Implementing NextAuth.js (Auth.js)

NextAuth handles the complexity of OAuth handshakes (Google, GitHub, etc.) and session management.

\`\`\`ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role; // Persist RBAC
      return session;
    }
  }
})
\`\`\`

Middleware is used to protect routes at the edge.`,
          keyTakeaways: [
            "AuthN is identity; AuthZ is permissions.",
            "JWTs are preferred for microservices/scalability; Sessions are preferred for strict security/revocability.",
            "NextAuth.js middleware can protect routes before they even render."
          ],
          assignment: "Implement GitHub OAuth login. Once logged in, extend the session object to include a custom 'role' field stored in your database.",
          resources: [
            {
              title: "Auth.js Documentation",
              url: "https://authjs.dev/",
              type: "article"
            },
            {
              title: "OAuth 2.0 Simplified",
              url: "https://www.oauth.com/",
              type: "book"
            }
          ],
          quiz: [
            {
              question: "What is the main downside of a stateless JWT?",
              options: ["It is visible to the user", "It cannot be revoked immediately without complex architecture", "It is slower than a database", "It only supports numbers"],
              correctAnswerIndex: 1,
              explanation: "Since the token is self-contained and validated by signature, the server considers it valid until it expires, even if the user was banned in the DB."
            },
            {
              question: "What is middleware in Next.js used for in the context of Auth?",
              options: ["To style the login page", "To intercept requests and redirect unauthenticated users", "To store passwords", "To run database migrations"],
              correctAnswerIndex: 1,
              explanation: "Middleware runs before the request is processed, allowing you to check for a session token and redirect to /login if it's missing."
            },
            {
              question: "Why should you never store sensitive data in a JWT?",
              options: ["It is encrypted", "It is base64 encoded and easily readable by the client", "It makes the token too heavy", "It causes CORS errors"],
              correctAnswerIndex: 1,
              explanation: "JWTs are signed (tamper-proof) but usually not encrypted (readable). Anyone with the token can decode it and read the payload."
            }
          ]
        },
        {
          title: "RBAC & Row Level Security",
          duration: "1h 15m",
          content: `### Role-Based Access Control (RBAC)
          
RBAC restricts network access based on the roles of individual users within an enterprise.

1.  **Define Roles**: Admin, Editor, Viewer.
2.  **Check Roles**: In Server Actions or API routes.

\`\`\`ts
// Server Action
export async function deletePost(id: number) {
  const session = await auth();
  if (session.user.role !== 'ADMIN') {
    throw new Error("Unauthorized");
  }
  await db.post.delete({ where: { id } });
}
\`\`\`

### Security Best Practices

1.  **CSRF (Cross-Site Request Forgery)**: Next.js handles this automatically for Server Actions.
2.  **Input Validation**: Never trust user input. Use libraries like **Zod** to validate schemas before processing.

\`\`\`ts
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});

const result = schema.safeParse(input);
if (!result.success) return { error: result.error };
\`\`\`

3.  **SQL Injection**: Using an ORM like Prisma virtually eliminates this risk as it uses parameterized queries.`,
          keyTakeaways: [
            "Authorization checks must happen on the Server, never solely on the Client.",
            "Zod should be used to validate all incoming data (params, body, searchParams).",
            "Role checks should be centralized or implemented via middleware where possible."
          ],
          assignment: "Create an admin-only route. Use Zod to validate a form submission that updates a user's email address.",
          resources: [
            {
              title: "OWASP Top 10 Security Risks",
              url: "https://owasp.org/www-project-top-ten/",
              type: "article"
            },
            {
              title: "Zod Documentation",
              url: "https://zod.dev/",
              type: "tool"
            }
          ],
          quiz: [
            {
              question: "Where is the most secure place to validate user permissions?",
              options: ["In the React Component (Client)", "In the CSS", "On the Server (API/Action)", "In the URL"],
              correctAnswerIndex: 2,
              explanation: "Client-side checks can be bypassed by simply sending a fetch request manually. The server is the only trusted environment."
            },
            {
              question: "What is Zod used for?",
              options: ["Database connection", "Schema declaration and validation", "Authentication", "CSS styling"],
              correctAnswerIndex: 1,
              explanation: "Zod is a TypeScript-first schema declaration and validation library, essential for verifying unknown data structures."
            },
            {
              question: "How does Prisma prevent SQL Injection?",
              options: ["It doesn't", "It uses Parameterized Queries (Prepared Statements)", "It uses regex", "It runs in a sandbox"],
              correctAnswerIndex: 1,
              explanation: "ORM engines separate the SQL code from the data values, ensuring that user input is never interpreted as executable SQL commands."
            }
          ]
        }
      ]
    },
    {
      title: "Module 4: State Management & Patterns",
      description: "Managing complex application state with Zustand, Context, and URL state.",
      lessons: [
        {
          title: "URL as the Source of Truth",
          duration: "45m",
          content: `### The Shareable State
          
In standard React SPAs, we often overuse \`useState\`. In Next.js applications, the URL should be the primary source of truth for "shareable" state (search filters, pagination, active tabs).

**Why?**
1.  **Shareability**: Users can copy/paste the URL to share the exact view.
2.  **History**: The back button works as expected.
3.  **Server Rendering**: The server can read URL params to render the correct initial state.

#### Implementation

Use \`useSearchParams\` and \`usePathname\`.

\`\`\`tsx
// SearchComponent.tsx
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('query', term);
    else params.delete('query');
    
    replace(\`\${pathname}?\${params.toString()}\`);
  }
}
\`\`\`
`,
          keyTakeaways: [
            "Store global UI state (filters, sort, pagination) in the URL.",
            "This enables deep linking and better UX.",
            "Use useSearchParams to read and useRouter to update."
          ],
          assignment: "Build a product filtering sidebar. When a category is checked, update the URL query parameters. Ensure the checkboxes remain checked on page reload.",
          resources: [
            {
              title: "Next.js URL Search Params",
              url: "https://nextjs.org/docs/app/api-reference/functions/use-search-params",
              type: "article"
            },
            {
              title: "State Management in Next.js",
              url: "https://vercel.com/guides/react-context-state-management-nextjs",
              type: "article"
            }
          ],
          quiz: [
            {
              question: "Why is storing state in the URL better than Redux for search filters?",
              options: ["It is faster", "It allows the state to be shared and bookmarked", "It uses less memory", "It works offline"],
              correctAnswerIndex: 1,
              explanation: "The primary benefit is shareability. If state is only in memory (Redux), sending the link to a friend will result in them seeing a default page, not the filtered view."
            },
            {
              question: "Which hook provides read access to query strings in App Router?",
              options: ["useQuery", "useSearchParams", "useRouter", "useUrl"],
              correctAnswerIndex: 1,
              explanation: "useSearchParams() returns a read-only version of the URLSearchParams interface."
            },
            {
              question: "What does router.replace() do?",
              options: ["Navigates to a new route", "Replaces the current history entry without adding a new one", "Reloads the page", "Deletes the route"],
              correctAnswerIndex: 1,
              explanation: "Replace updates the URL without pushing a new entry to the browser's history stack, which is often preferred for filtering updates so the 'Back' button doesn't undo every single checkbox click."
            }
          ]
        },
        {
          title: "Global State with Zustand",
          duration: "45m",
          content: `### When Context is Not Enough
          
React Context is great for dependency injection, but bad for high-frequency updates due to unnecessary re-renders of the entire tree.

**Zustand** is a small, fast state management library that uses the flux pattern but simplified.

#### Creating a Store

\`\`\`ts
import { create } from 'zustand'

type Store = {
  bears: number
  increase: () => void
}

const useStore = create<Store>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
}))
\`\`\`

#### Using the Store

\`\`\`tsx
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}
\`\`\`

Zustand allows components to subscribe to *slices* of state, preventing re-renders if unrelated parts of the store change.`,
          keyTakeaways: [
            "Zustand solves the 'Context Hell' and re-render issues.",
            "It works outside of React components (great for reading tokens).",
            "It is lightweight and boilerplate-free compared to Redux."
          ],
          assignment: "Implement a shopping cart using Zustand. Create a persistent store (using persist middleware) that saves the cart items to localStorage.",
          resources: [
            {
              title: "Zustand Documentation",
              url: "https://docs.pmnd.rs/zustand",
              type: "tool"
            },
            {
              title: "React State Management Libraries Compared",
              url: "https://npmtrends.com/jotai-vs-mobx-vs-recoil-vs-redux-vs-xstate-vs-zustand",
              type: "article"
            }
          ],
          quiz: [
            {
              question: "What is the main performance issue with React Context?",
              options: ["It is hard to learn", "It causes all consumers to re-render when any part of the value changes", "It cannot hold objects", "It is deprecated"],
              correctAnswerIndex: 1,
              explanation: "Context does not allow granular subscriptions. If the context value is an object with {a, b}, and 'a' changes, a component only using 'b' will still re-render."
            },
            {
              question: "How does Zustand select state?",
              options: ["Via a selector function", "Via a higher order component", "Via props", "It selects everything"],
              correctAnswerIndex: 0,
              explanation: "You pass a selector function `state => state.property` to the hook, ensuring the component only re-renders when that specific return value changes."
            },
            {
              question: "Can Zustand be used with Server Components?",
              options: ["Yes", "No", "Only for initial state", "Only with Redux"],
              correctAnswerIndex: 1,
              explanation: "State management libraries like Zustand rely on React hooks and browser memory. They cannot run on the server. They are for Client Components only."
            }
          ]
        }
      ]
    },
    {
      title: "Module 5: Testing & DevOps",
      description: "Ensuring code quality with E2E testing, CI/CD pipelines, and monitoring.",
      lessons: [
        {
          title: "E2E Testing with Playwright",
          duration: "1h 00m",
          content: `### Testing Reality, Not Mocks
          
Unit tests (Jest/Vitest) are good for logic, but End-to-End (E2E) tests are vital for web apps. They simulate a real user opening a browser, clicking buttons, and navigating.

**Playwright** is the modern standard for E2E testing. It is fast, reliable, and handles modern web features like hydration automatically.

#### Writing a Test

\`\`\`ts
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://localhost:3000');
  await expect(page).toHaveTitle(/Next.js/);
});

test('can login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
});
\`\`\`

Playwright runs in headless browsers (Chromium, Firefox, WebKit) and can capture videos and traces of failed tests.`,
          keyTakeaways: [
            "E2E tests verify the full stack (Frontend + Backend + DB).",
            "Playwright is preferred over Cypress for its speed and parallel execution support.",
            "Test critical flows (Login, Checkout, Critical Path) first."
          ],
          assignment: "Write a Playwright test specification that verifies the entire checkout flow of your e-commerce application.",
          resources: [
            {
              title: "Playwright Documentation",
              url: "https://playwright.dev/",
              type: "tool"
            },
            {
              title: "Testing Trophy vs Pyramid",
              url: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications",
              type: "article"
            }
          ],
          quiz: [
            {
              question: "What does 'Headless Browser' mean?",
              options: ["A browser without a GUI", "A browser without a brain", "A browser for headers only", "A mobile browser"],
              correctAnswerIndex: 0,
              explanation: "A headless browser runs in the background without a visible user interface, allowing tests to run faster and on servers (CI/CD)."
            },
            {
              question: "Why are E2E tests considered 'expensive'?",
              options: ["They cost money to run", "They are slow to execute compared to unit tests", "They require expensive software", "They are hard to write"],
              correctAnswerIndex: 1,
              explanation: "E2E tests involve spinning up a browser, network requests, and database hits, making them significantly slower than in-memory unit tests."
            },
            {
              question: "What is a 'Trace' in Playwright?",
              options: ["A drawing", "A log of all actions, network requests, and snapshots during a test", "A console log", "A database record"],
              correctAnswerIndex: 1,
              explanation: "Traces allow you to 'time travel' through the test execution to debug exactly why and where a test failed."
            }
          ]
        },
        {
          title: "CI/CD & Monitoring",
          duration: "45m",
          content: `### Continuous Integration / Continuous Deployment
          
Automating the path from \`git push\` to production.

1.  **Linting & Formatting**: Ensure code style (ESLint, Prettier).
2.  **Type Checking**: Ensure no TS errors (\`tsc --noEmit\`).
3.  **Testing**: Run Unit and E2E tests.
4.  **Build**: Verify the app builds.
5.  **Deploy**: Push to Vercel/AWS.

#### GitHub Actions Example

\`\`\`yaml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
\`\`\`

### Monitoring with Sentry

Once in production, you need to know when things break. **Sentry** provides real-time error tracking. It captures the stack trace, user session, and release version.`,
          keyTakeaways: [
            "CI prevents bad code from merging into main.",
            "CD ensures users always have the latest version.",
            "Observability (Logging/Monitoring) is crucial for fixing production bugs."
          ],
          assignment: "Set up a GitHub Action workflow that runs the linter and unit tests on every Pull Request.",
          resources: [
            {
              title: "GitHub Actions Documentation",
              url: "https://docs.github.com/en/actions",
              type: "tool"
            },
            {
              title: "Vercel Deployment Guide",
              url: "https://vercel.com/docs/deployments/overview",
              type: "article"
            }
          ],
          quiz: [
            {
              question: "What does 'CI' stand for?",
              options: ["Continuous Intelligence", "Continuous Integration", "Code Inspection", "Cloud Infrastructure"],
              correctAnswerIndex: 1,
              explanation: "Continuous Integration is the practice of merging all developers' working copies to a shared mainline several times a day."
            },
            {
              question: "What is the purpose of Sentry?",
              options: ["To deploy the app", "To act as a database", "To track runtime errors and performance", "To manage project tasks"],
              correctAnswerIndex: 2,
              explanation: "Sentry aggregates error logs from user sessions, alerting developers to crashes that happen in the wild."
            },
            {
              question: "When should tests run in a CI pipeline?",
              options: ["After deployment", "Before merging/deployment", "Once a month", "Manually"],
              correctAnswerIndex: 1,
              explanation: "Tests should act as a gatekeeper. If tests fail, the code should not be merged or deployed."
            }
          ]
        }
      ]
    }
  ],
  finalExam: {
    title: "Full Stack Architect Certification Exam",
    questions: [
      {
        id: 1,
        text: "Which feature allows components to run exclusively on the server in Next.js?",
        options: ["Client Components", "React Hooks", "Context API", "React Server Components"],
        correctAnswerIndex: 3
      },
      {
        id: 2,
        text: "What is the recommended file to handle loading states in the Next.js App Router?",
        options: ["error.tsx", "page.tsx", "layout.tsx", "loading.tsx"],
        correctAnswerIndex: 3
      },
      {
        id: 3,
        text: "Which method is used in Prisma to create a transaction to ensure ACID compliance?",
        options: ["prisma.create", "prisma.update", "prisma.delete", "prisma.$transaction"],
        correctAnswerIndex: 3
      },
      {
        id: 4,
        text: "What tool is recommended for E2E testing in this course?",
        options: ["Jest", "Mocha", "Selenium", "Playwright"],
        correctAnswerIndex: 3
      },
      {
        id: 5,
        text: "Which library was introduced for simplified global state management in this course?",
        options: ["Redux", "MobX", "Recoil", "Zustand"],
        correctAnswerIndex: 3
      }
    ]
  }
};