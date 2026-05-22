# 🏦 Bank Simulator

Банковский симулятор / Investment game на русском языке.

Стройте финансовую империю с нуля: карьера, акции, криптовалюта, недвижимость, авто, бизнес. Цель — $10M капитала.

## Установка и запуск одной командой

```bash
git clone https://github.com/Krembovan/BankSimulator.git && cd BankSimulator && npm install && npm run build && npm start
```

После запуска игра откроется в браузере по адресу `http://localhost:3000`.

## Для Windows (без Node.js)

Скомпилированный .exe можно найти в [Releases](https://github.com/Krembovan/BankSimulator/releases) — просто скачайте `BankSimulator.exe` и `dist/` рядом с ним и запустите.

```bash
npm run pkg:win
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Режим разработки (Vite dev server) |
| `npm run build` | Production сборка |
| `npm start` | Запуск HTTP-сервера с игрой |
| `npm run pkg:win` | Сборка Windows .exe |

## Стек

- React 19 + TypeScript
- Vite
- Recharts (графики)
- Node.js HTTP-сервер (запуск без зависимостей)
