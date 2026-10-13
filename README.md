# Playwright-песочница (Sauce Demo)

Учебный репозиторий для E2E на [Sauce Demo](https://www.saucedemo.com).

## Структура

| Папка / файл | Назначение |
|--------------|------------|
| `data/` | Тестовые пользователи и товары |
| `fixtures/` | Playwright-фикстуры (логин перед тестом) |
| `pages/` | Page Object (логин, каталог, корзина) |
| `tests/saucedemo/` | Сценарии |
| `app/` | Pet-project витрина (Vite + React) для GitHub Pages |
| `playwright.config.ts` | `baseURL`, Chromium, `testIdAttribute: 'data-test'` |

## GitHub Pages (свой сайт)

**URL после деплоя:** https://alyonagolovnina.github.io/tests/

### Один раз в GitHub

1. Репозиторий **tests** → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**

### Локально (папка `app/`)

```bash
cd app
npm install
npm run dev          # http://localhost:5173/tests/
npm run build        # артефакт в app/dist
npm run preview      # проверка production-сборки
```

### Деплой

При `git push` в ветку **DEVELOP** (или `main`) запускается workflow **Deploy GitHub Pages** (`.github/workflows/deploy-pages.yml`).

Статус: вкладка **Actions** → workflow **Deploy GitHub Pages** → ссылка **github-pages** environment.

Элементы витрины помечены **`data-testid`** — позже можно подключить Playwright с `testIdAttribute: 'data-testid'`.

## Требования

- Node.js 18+
- Зависимости: `npm ci`
- Браузер: `npx playwright install chromium`

Локаторы в Page Object — через `getByTestId(...)` (атрибут `data-test` на Sauce Demo). Заголовки страниц (`.title`) на демо **без** `data-test`, поэтому «страница загружена» проверяем по URL и якорным элементам (`product-sort-container`, `checkout`, `firstName`, `finish`, `complete-header`).

## Фикстуры авторизации

В `fixtures/auth.fixture.ts` логин вынесен из тестов:

- `standardInventory` — `standard_user` на каталоге
- `problemInventory` — `problem_user`
- `errorInventory` — `error_user`
- `errorCheckoutInfo` — `error_user` на шаге checkout (корзина с backpack)

Импорт в тестах: `import { test, expect } from '../../fixtures/auth.fixture'`.  
Файл `login.spec.ts` по-прежнему использует `@playwright/test` — там проверяется сам логин.

## Команды

```bash
npm test                 # все тесты (Chromium)
npm run test:saucedemo   # только Sauce Demo
npm run test:saucedemo:headed   # Sauce Demo с видимым браузером (1 worker, slowMo 750 ms)
npm run test:headed      # все тесты с окном браузера
npm run test:ui          # UI mode (на Windows — через 127.0.0.1, см. ниже)
npm run report           # HTML-отчёт после прогона
```

## Учебные сценарии (уже в репо)

1. **login** — успешный вход и заблокированный пользователь
2. **cart** — добавление в корзину и проверка badge / списка
3. **checkout** — оформление заказа до экрана «Thank you for your order!»
4. **inventory-sort** — сортировка по имени и цене на inventory.html
5. **problem-user** — логин `problem_user`, битые картинки, корзина всё ещё работает
6. **error-user** — `error_user`: сортировка, add-to-cart, checkout (last name, finish)

В headed-режиме (`--headed`) тесты идут **по одному** и с паузой **750 ms** между действиями. Другая скорость: `$env:PLAYWRIGHT_SLOW_MO=1200; npm run test:saucedemo:headed`

### UI mode на Windows (`ERR_NETWORK_ACCESS_DENIED`)

Если при `playwright test --ui` браузер не открывается и в логе `http://[::1]:...` / `net::ERR_NETWORK_ACCESS_DENIED`, заставьте UI слушать **IPv4**:

```bash
npx playwright test --ui --ui-host=127.0.0.1
```

или `npm run test:ui` (уже настроено в `package.json`). Часто мешают VPN, виртуальные адаптеры (Hyper-V, WSL) или профиль сети «Public» — тогда проверьте, что сеть помечена как частная, и разрешите Node/Chromium в брандмауэре.

## Идеи для самостоятельной практики

- Сортировка товаров на inventory
- Удаление товара из корзины
- Checkout (шаги 1–3) с заполнением формы
- Добавить fixture `storageState` для ускорения прогона (опционально)

## Демо-аккаунты

| Пользователь | Пароль | Зачем |
|--------------|--------|--------|
| `standard_user` | `secret_sauce` | Основные сценарии |
| `locked_out_user` | `secret_sauce` | Негативный логин |

Полный список — на сайте Sauce Demo.
