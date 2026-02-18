# 🚀 Развёртывание на Selectel (Ubuntu 24.04 LTS)

Полное руководство по развёртыванию бэкенда и базы данных на облачном сервере Selectel.

## 📋 Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Этап 1: Исправление Docker](#этап-1-исправление-docker)
3. [Этап 2: Подготовка к production](#этап-2-подготовка-к-production)
4. [Этап 3: Развёртывание](#этап-3-развёртывание)
5. [Этап 4: Проверка и мониторинг](#этап-4-проверка-и-мониторинг)
6. [Решение проблем](#решение-проблем)

---

## 📋 Предварительные требования

✅ VPS на Selectel с Ubuntu 24.04 LTS
✅ SSH доступ к серверу (root или пользователь с sudo)
✅ Репозиторий уже клонирован на сервер
✅ Телеграм бот уже запущен

---

## 🔧 Этап 1: Исправление Docker

### Проблема
На Ubuntu 24.04 установлена старая версия `docker-compose` (1.29.2), которая несовместима с Python 3.12.

### Решение

**Шаг 1: Подключитесь к серверу**
```bash
ssh root@ВАШ_IP_АДРЕС
```

**Шаг 2: Удалите старый docker-compose**
```bash
sudo apt remove docker-compose -y
```

**Шаг 3: Установите Docker Compose V2 (встроенный в Docker)**
```bash
sudo apt update
sudo apt install -y docker-compose-plugin
```

**Шаг 4: Проверьте версию**
```bash
docker compose version
```

Должно вывести что-то вроде:
```
Docker Compose version v2.x.x
```

---

## 📝 Этап 2: Подготовка к production

### Шаг 1: Перейдите в папку backend

```bash
cd ~/sofar5/backend
```

### Шаг 2: Создайте production .env файл

```bash
cat > .env << 'EOF'
# Database
DB_USER=assortiuser
DB_PASSWORD=ИЗМЕНИТЕ_НА_СЛОЖНЫЙ_ПАРОЛЬ_123!@#
DB_NAME=assortiShop
DATABASE_URL="postgresql://assortiuser:ИЗМЕНИТЕ_НА_СЛОЖНЫЙ_ПАРОЛЬ_123!@#@postgres:5432/assortiShop"

# Server
PORT=3000
NODE_ENV=production

# API (замените на ваш реальный IP или домен)
API_URL=http://ВАШ_IP_АДРЕС:3000
FRONTEND_URL=http://ВАШ_IP_АДРЕС:5173
EOF
```

⚠️ **ВАЖНО:** Замените `ИЗМЕНИТЕ_НА_СЛОЖНЫЙ_ПАРОЛЬ_123!@#` на сложный пароль!

Пример сложного пароля:
```bash
openssl rand -base64 32
```

### Шаг 3: Скопируйте production docker-compose файл

Создайте файл `docker-compose.prod.yml`:

```bash
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: assortiShop_db
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - assortiShop_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: assortiShop_backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NODE_ENV: ${NODE_ENV}
      PORT: 3000
      API_URL: ${API_URL}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - assortiShop_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres_data:
    driver: local

networks:
  assortiShop_network:
    driver: bridge
EOF
```

---

## 🚀 Этап 3: Развёртывание

### Шаг 1: Запустите контейнеры

```bash
docker compose -f docker-compose.prod.yml up -d
```

Это запустит:
- PostgreSQL базу данных
- Backend приложение

### Шаг 2: Проверьте статус контейнеров

```bash
docker compose -f docker-compose.prod.yml ps
```

Должно вывести:
```
NAME                    STATUS
assortiShop_db          Up (healthy)
assortiShop_backend     Up
```

### Шаг 3: Запустите миграции Prisma

```bash
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

Это создаст таблицы в БД.

### Шаг 4: Проверьте логи

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

Должны увидеть:
```
Server is running on port 3000
```

Нажмите `Ctrl+C` чтобы выйти из логов.

---

## ✅ Этап 4: Проверка и мониторинг

### Проверка 1: Health Check

```bash
curl http://localhost:3000/api/health
```

Должен вернуть:
```json
{"status":"OK","timestamp":"2026-02-18T..."}
```

### Проверка 2: Получить продукты

```bash
curl http://localhost:3000/api/products
```

### Проверка 3: Просмотр логов

```bash
# Логи backend
docker compose -f docker-compose.prod.yml logs backend

# Логи БД
docker compose -f docker-compose.prod.yml logs postgres

# Логи в реальном времени
docker compose -f docker-compose.prod.yml logs -f
```

### Проверка 4: Подключение к БД

```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop -c "SELECT * FROM products LIMIT 5;"
```

---

## 🔄 Автозапуск при перезагрузке сервера

### Способ 1: Systemd сервис (РЕКОМЕНДУЕТСЯ)

**Шаг 1: Создайте systemd сервис**

```bash
sudo tee /etc/systemd/system/assortiShop.service > /dev/null << 'EOF'
[Unit]
Description=AssortiShop Backend and Database
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/root/sofar5/backend
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF
```

**Шаг 2: Включите сервис**

```bash
sudo systemctl daemon-reload
sudo systemctl enable assortiShop.service
sudo systemctl start assortiShop.service
```

**Шаг 3: Проверьте статус**

```bash
sudo systemctl status assortiShop.service
```

### Способ 2: Cron (альтернатива)

```bash
crontab -e
```

Добавьте строку:
```
@reboot cd /root/sofar5/backend && docker compose -f docker-compose.prod.yml up -d
```

---

## 📊 Полезные команды

### Просмотр статуса

```bash
# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Список образов
docker images
```

### Управление контейнерами

```bash
# Остановить контейнеры
docker compose -f docker-compose.prod.yml down

# Перезагрузить контейнеры
docker compose -f docker-compose.prod.yml restart

# Пересобрать образ
docker compose -f docker-compose.prod.yml build --no-cache

# Обновить и перезагрузить
docker compose -f docker-compose.prod.yml up -d --build
```

### Работа с БД

```bash
# Подключиться к БД
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop

# Резервная копия БД
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup.sql

# Восстановление из резервной копии
docker compose -f docker-compose.prod.yml exec -T postgres psql -U assortiuser assortiShop < backup.sql
```

### Просмотр логов

```bash
# Последние 100 строк
docker compose -f docker-compose.prod.yml logs --tail=100

# В реальном времени
docker compose -f docker-compose.prod.yml logs -f

# Только backend
docker compose -f docker-compose.prod.yml logs backend

# Только БД
docker compose -f docker-compose.prod.yml logs postgres
```

---

## 🐛 Решение проблем

### Проблема 1: docker compose: command not found

**Решение:**
```bash
sudo apt install -y docker-compose-plugin
```

### Проблема 2: Permission denied while trying to connect to Docker daemon

**Решение:**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Проблема 3: Port 3000 already in use

**Решение:**
```bash
# Найти процесс на порту 3000
sudo lsof -i :3000

# Убить процесс
sudo kill -9 PID

# Или изменить порт в .env файле
```

### Проблема 4: Database connection refused

**Решение:**
```bash
# Проверить статус БД
docker compose -f docker-compose.prod.yml ps postgres

# Посмотреть логи БД
docker compose -f docker-compose.prod.yml logs postgres

# Перезагрузить БД
docker compose -f docker-compose.prod.yml restart postgres
```

### Проблема 5: Миграции не применились

**Решение:**
```bash
# Запустить миграции вручную
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate

# Или сгенерировать Prisma клиент
docker compose -f docker-compose.prod.yml exec backend npm run prisma:generate
```

### Проблема 6: Backend не запускается

**Решение:**
```bash
# Посмотреть логи
docker compose -f docker-compose.prod.yml logs backend

# Пересобрать образ
docker compose -f docker-compose.prod.yml build --no-cache

# Перезагрузить
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🔐 Безопасность

### Рекомендации

1. **Используйте сложные пароли** для БД
2. **Ограничьте доступ к портам** через firewall
3. **Используйте HTTPS** для production (nginx + Let's Encrypt)
4. **Регулярно обновляйте** Docker образы
5. **Делайте резервные копии** БД

### Firewall правила (UFW)

```bash
# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP
sudo ufw allow 80/tcp

# Разрешить HTTPS
sudo ufw allow 443/tcp

# Разрешить только для backend (если нужно)
sudo ufw allow from 127.0.0.1 to 127.0.0.1 port 3000

# Включить firewall
sudo ufw enable
```

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker compose -f docker-compose.prod.yml logs`
2. Убедитесь, что Docker запущен: `docker ps`
3. Проверьте переменные окружения: `cat .env`
4. Перезагрузите контейнеры: `docker compose -f docker-compose.prod.yml restart`

---

## ✨ Готово!

Ваш бэкенд и БД развёрнуты на Selectel и готовы к работе! 🎉

**Полезные ссылки:**
- API документация: `http://ВАШ_IP:3000/api-docs`
- Health check: `http://ВАШ_IP:3000/api/health`
- Swagger UI: `http://ВАШ_IP:3000/api-docs`
