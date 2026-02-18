# 📚 Индекс документации по развёртыванию на Selectel

Полный указатель всех документов и файлов для развёртывания бэкенда и БД на облачном сервере Selectel.

## 🎯 Начните отсюда

### Для новичков
1. **[QUICK_START_SELECTEL.md](./QUICK_START_SELECTEL.md)** ⚡
   - Быстрый старт за 5 минут
   - Основные команды
   - Чек-лист

### Для опытных
1. **[SELECTEL_COMMANDS.md](./SELECTEL_COMMANDS.md)** 🖥️
   - Готовые команды для копирования
   - Все операции с Docker
   - Решение проблем

### Для полного понимания
1. **[SELECTEL_DEPLOYMENT.md](./SELECTEL_DEPLOYMENT.md)** 📖
   - Полное пошаговое руководство
   - Все этапы развёртывания
   - Безопасность и мониторинг

---

## 📁 Структура документации

```
version-five/
│
├── 📚 ДОКУМЕНТАЦИЯ
│   ├── SELECTEL_INDEX.md                    ← Вы здесь
│   ├── QUICK_START_SELECTEL.md              ⚡ Быстрый старт
│   ├── SELECTEL_COMMANDS.md                 🖥️ Готовые команды
│   ├── SELECTEL_DEPLOYMENT.md               📖 Полное руководство
│   ├── SELECTEL_DEPLOYMENT_SUMMARY.md       📋 Резюме
│
└── backend/
    ├── 🔧 КОНФИГУРАЦИЯ
    │   ├── docker-compose.prod.yml          🐳 Production Docker Compose
    │   ├── .env.production                  🔐 Шаблон переменных
    │   ├── assortiShop.service              🔄 Systemd сервис
    │   └── deploy.sh                        🚀 Скрипт развёртывания
    │
    ├── docker/
    │   └── Dockerfile                       🐳 Docker образ
    │
    ├── prisma/
    │   └── schema.prisma                    🗄️ Схема БД
    │
    └── src/
        └── ...                              💻 Исходный код
```

---

## 🚀 Пошаговое развёртывание

### Этап 1: Подготовка (5 минут)

**На локальной машине:**
```bash
# Убедитесь, что все файлы закоммичены
git add .
git commit -m "Add Selectel deployment files"
git push
```

**Документация:** [SELECTEL_DEPLOYMENT.md - Этап 1](./SELECTEL_DEPLOYMENT.md#этап-1-исправление-docker)

### Этап 2: Исправление Docker (5 минут)

**На сервере Selectel:**
```bash
ssh root@ВАШ_IP_АДРЕС
cd ~/sofar5/backend

# Исправить Docker Compose
sudo apt remove docker-compose -y
sudo apt update
sudo apt install -y docker-compose-plugin
docker compose version
```

**Документация:** [SELECTEL_COMMANDS.md - Исправление Docker](./SELECTEL_COMMANDS.md#исправление-docker)

### Этап 3: Подготовка окружения (5 минут)

**На сервере:**
```bash
# Создать .env файл
cp .env.production .env

# Отредактировать .env
nano .env
# Установить: DB_PASSWORD, API_URL, FRONTEND_URL
```

**Документация:** [SELECTEL_COMMANDS.md - Подготовка окружения](./SELECTEL_COMMANDS.md#подготовка-окружения)

### Этап 4: Развёртывание (10 минут)

**На сервере:**
```bash
# Способ 1: Автоматический (РЕКОМЕНДУЕТСЯ)
chmod +x deploy.sh
sudo ./deploy.sh

# Способ 2: Ручной
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

**Документация:** [SELECTEL_COMMANDS.md - Развёртывание](./SELECTEL_COMMANDS.md#развёртывание)

### Этап 5: Проверка (5 минут)

**На сервере:**
```bash
# Проверить статус
docker compose -f docker-compose.prod.yml ps

# Проверить health check
curl http://localhost:3000/api/health

# Проверить логи
docker compose -f docker-compose.prod.yml logs
```

**Документация:** [SELECTEL_COMMANDS.md - Проверка](./SELECTEL_COMMANDS.md#проверка)

### Этап 6: Автозапуск (5 минут)

**На сервере:**
```bash
# Установить systemd сервис
sudo cp assortiShop.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable assortiShop.service
sudo systemctl start assortiShop.service
```

**Документация:** [SELECTEL_COMMANDS.md - Автозапуск](./SELECTEL_COMMANDS.md#автозапуск)

---

## 📊 Файлы конфигурации

### 1. docker-compose.prod.yml
**Назначение:** Production конфигурация Docker Compose

**Ключевые особенности:**
- ♻️ Автоперезагрузка контейнеров (`restart: always`)
- 📊 Логирование в JSON формате
- 🏥 Health checks для БД
- 🔗 Сетевое взаимодействие между контейнерами

**Использование:**
```bash
docker compose -f docker-compose.prod.yml up -d
```

### 2. .env.production
**Назначение:** Шаблон переменных окружения для production

**Что нужно изменить:**
- `DB_PASSWORD` - установить сложный пароль
- `API_URL` - установить IP или домен сервера
- `FRONTEND_URL` - установить IP или домен сервера

**Использование:**
```bash
cp .env.production .env
nano .env  # Отредактировать
```

### 3. deploy.sh
**Назначение:** Автоматический скрипт развёртывания

**Что делает:**
- ✅ Устанавливает Docker Compose V2
- ✅ Проверяет .env файл
- ✅ Собирает Docker образы
- ✅ Запускает контейнеры
- ✅ Выполняет миграции БД
- ✅ Проверяет здоровье приложения

**Использование:**
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

### 4. assortiShop.service
**Назначение:** Systemd сервис для автозапуска

**Что делает:**
- 🔄 Автозапуск при перезагрузке сервера
- 📝 Логирование в systemd journal
- 🔧 Автоматический перезапуск при ошибке

**Использование:**
```bash
sudo cp assortiShop.service /etc/systemd/system/
sudo systemctl enable assortiShop.service
```

---

## 🔧 Полезные команды

### Просмотр статуса
```bash
docker compose -f docker-compose.prod.yml ps
docker stats
sudo systemctl status assortiShop.service
```

### Управление контейнерами
```bash
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Просмотр логов
```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs backend
sudo journalctl -u assortiShop.service -f
```

### Работа с БД
```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup.sql
```

**Полный список:** [SELECTEL_COMMANDS.md - Полезные команды](./SELECTEL_COMMANDS.md#полезные-команды)

---

## 🐛 Решение проблем

### Частые проблемы

| Проблема | Решение | Документация |
|---------|--------|--------------|
| `docker compose: command not found` | `sudo apt install -y docker-compose-plugin` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-1-docker-compose-command-not-found) |
| `Permission denied` | `sudo usermod -aG docker $USER` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-2-permission-denied-while-trying-to-connect-to-docker-daemon) |
| `Port 3000 already in use` | `sudo lsof -i :3000` и `sudo kill -9 PID` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-3-port-3000-already-in-use) |
| `Database connection refused` | `docker compose -f docker-compose.prod.yml restart postgres` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-4-database-connection-refused) |
| `Миграции не применились` | `docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-5-миграции-не-применились) |
| `Backend не запускается` | `docker compose -f docker-compose.prod.yml logs backend` | [Ссылка](./SELECTEL_COMMANDS.md#проблема-6-backend-не-запускается) |

**Полный список:** [SELECTEL_COMMANDS.md - Решение проблем](./SELECTEL_COMMANDS.md#решение-проблем)

---

## 🔐 Безопасность

### Рекомендации

1. ✅ **Используйте сложные пароли**
   ```bash
   openssl rand -base64 32
   ```

2. ✅ **Ограничьте доступ к портам**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. ✅ **Используйте HTTPS** (nginx + Let's Encrypt)

4. ✅ **Регулярно обновляйте** Docker образы

5. ✅ **Делайте резервные копии** БД
   ```bash
   docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup.sql
   ```

**Полная информация:** [SELECTEL_DEPLOYMENT.md - Безопасность](./SELECTEL_DEPLOYMENT.md#безопасность)

---

## 📞 Поддержка

### Если что-то не работает

1. 📖 Прочитайте [SELECTEL_DEPLOYMENT.md](./SELECTEL_DEPLOYMENT.md)
2. 🔍 Проверьте логи: `docker compose -f docker-compose.prod.yml logs`
3. ✅ Убедитесь, что Docker запущен: `docker ps`
4. 📝 Проверьте переменные окружения: `cat .env`
5. 🔄 Перезагрузите контейнеры: `docker compose -f docker-compose.prod.yml restart`

### Быстрая диагностика

```bash
# Вывести всю информацию о системе
echo "=== Docker версия ===" && docker --version
echo "=== Docker Compose версия ===" && docker compose version
echo "=== Статус контейнеров ===" && docker compose -f docker-compose.prod.yml ps
echo "=== Использование ресурсов ===" && docker stats --no-stream
echo "=== Логи backend ===" && docker compose -f docker-compose.prod.yml logs --tail=20 backend
```

---

## 📚 Дополнительные ресурсы

- [Docker документация](https://docs.docker.com/)
- [Docker Compose документация](https://docs.docker.com/compose/)
- [PostgreSQL документация](https://www.postgresql.org/docs/)
- [Prisma документация](https://www.prisma.io/docs/)
- [Express.js документация](https://expressjs.com/)
- [Selectel документация](https://docs.selectel.ru/)

---

## 🎯 Рекомендуемый порядок чтения

### Для быстрого развёртывания (15 минут)
1. [QUICK_START_SELECTEL.md](./QUICK_START_SELECTEL.md) - прочитайте
2. [SELECTEL_COMMANDS.md](./SELECTEL_COMMANDS.md) - копируйте команды
3. Развёртывайте!

### Для полного понимания (1 час)
1. [SELECTEL_DEPLOYMENT.md](./SELECTEL_DEPLOYMENT.md) - прочитайте полностью
2. [SELECTEL_DEPLOYMENT_SUMMARY.md](./SELECTEL_DEPLOYMENT_SUMMARY.md) - изучите структуру
3. [SELECTEL_COMMANDS.md](./SELECTEL_COMMANDS.md) - запомните команды

### Для опытных разработчиков
1. [SELECTEL_COMMANDS.md](./SELECTEL_COMMANDS.md) - используйте как справочник
2. [docker-compose.prod.yml](./backend/docker-compose.prod.yml) - модифицируйте под свои нужды
3. [deploy.sh](./backend/deploy.sh) - адаптируйте скрипт

---

## ✨ Готово!

Выберите документ и начните развёртывание! 🚀

**Быстрые ссылки:**
- ⚡ [Быстрый старт](./QUICK_START_SELECTEL.md)
- 🖥️ [Команды](./SELECTEL_COMMANDS.md)
- 📖 [Полное руководство](./SELECTEL_DEPLOYMENT.md)
- 📋 [Резюме](./SELECTEL_DEPLOYMENT_SUMMARY.md)

---

**Дата создания:** 18 февраля 2026
**Версия:** 1.0
**Статус:** ✅ Готово к использованию

Успехов в развёртывании! 🎉
