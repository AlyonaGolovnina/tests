# QA Portfolio Shop

Учебная витрина для портфолио QA: простой интернет-магазин на **React + Vite**, задеплоенный на **GitHub Pages**.

**Live:** https://alyonagolovnina.github.io/tests/

## Структура

| Путь | Назначение |
|------|------------|
| `app/` | Фронтенд (каталог, корзина-счётчик) |
| `app/src/` | React-компоненты, данные товаров |
| `.github/workflows/deploy-pages.yml` | Сборка и деплой на Pages |

Ключевые элементы помечены **`data-testid`** — удобно для будущих E2E (Playwright).

## Локальный запуск

```bash
cd app
npm install
npm run dev
```

Откройте http://localhost:5173/tests/

```bash
npm run build    # production в app/dist
npm run preview  # проверка сборки
```

## Деплой

При push в **DEVELOP** (или `main`) запускается workflow **Deploy GitHub Pages**.

В репозитории: **Settings → Pages → Source: GitHub Actions**.

## Playwright / Sauce Demo (только локально)

Песочница с E2E на [Sauce Demo](https://www.saucedemo.com) сохранена в **локальной** ветке `saucedemo-sandbox` (на GitHub не публикуется).

```bash
git checkout saucedemo-sandbox   # вернуться к тестам
git checkout DEVELOP             # снова только витрина
```
