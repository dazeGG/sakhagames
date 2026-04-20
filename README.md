# SakhaGames Frontend

Фронтенд для SakhaGames. Бэкенд находится в `../backend` и работает на PocketBase.

## Стек

- Nuxt 4
- Nuxt UI
- Tailwind CSS
- PocketBase JS SDK
- TypeScript

## Настройка

```bash
pnpm install
```

Переменная подключения к PocketBase:

```bash
POCKETBASE_URL=http://127.0.0.1:8090
```

## Разработка

```bash
pnpm dev
```

Проверка типов и линтинг:

```bash
pnpm typecheck
pnpm lint
```

## Сборка

```bash
pnpm build
```

```bash
pnpm preview
```
