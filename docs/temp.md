curl -X POST http://localhost:3000/api/departments \
-H "Content-Type: application/json" \
-d '{"name": "인프라팀"}'

NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm --filter frontend exec npx shadcn@latest add │
│ checkbox radio-group
