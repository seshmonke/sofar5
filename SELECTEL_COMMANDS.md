# 🖥️ Команды для развёртывания на Selectel

Готовые команды для копирования и вставки на сервер Selectel.

## 📋 Содержание

1. [Исправление Docker](#исправление-docker)
2. [Подготовка окружения](#подготовка-окружения)
3. [Развёртывание](#развёртывание)
4. [Проверка](#проверка)
5. [Автозапуск](#автозапуск)

---

## 🔧 Исправление Docker

Если у вас ошибка `ModuleNotFoundError: No module named 'distutils'`, выполните эти команды:

```bash
# Удалить старый docker-compose
sudo apt remove docker-compose -y

# Обновить пакеты
sudo apt update

# Установить Docker Compose V2
sudo apt install -y docker-compose-plugin

# Проверить версию
docker compose version
```

---

## 📝 Подготовка окружения

### Шаг 1: Перейти в папку backend

```bash
cd ~/sofar5/backend
```

### Шаг 2: Создать .env файл из шаблона

```bash
cp .env.production .env
```

### Шаг 3: Отредактировать .env файл

```bash
nano .env
```

**Что нужно изменить:**

1. `DB_PASSWORD` - установите сложный пароль (например, результат команды ниже):
   ```bash
   openssl rand -base64 32
   ```

2. `API_URL` - замените `YOUR_SERVER_IP` на ваш IP адрес сервера

3. `FRONTEND_URL` - замените `YOUR_SERVER_IP` на ваш IP адрес сервера

**Пример заполненного .env:**
```
DB_USER=assortiuser
DB_PASSWORD=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890==
DB_NAME=assortiShop
DATABASE_URL="postgresql://assortiuser:aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890==@postgres:5432/assortiShop"
PORT=3000
NODE_ENV=production
API_URL=http://192.168.1.100:3000
FRONTEND_URL=http://192.168.1.100:5173
```

Нажмите `Ctrl+X`, затем `Y`, затем `Enter` для сохранения.

---

## 🚀 Развёртывание

### Способ 1: Автоматический скрипт (РЕКОМЕНДУЕТСЯ)

```bash
# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запустить скрипт
sudo ./deploy.sh
```

Скрипт автоматически:
- ✅ Установит Docker Compose V2
- ✅ Проверит .env файл
- ✅ Соберёт Docker образы
- ✅ Запустит контейнеры
- ✅ Выполнит миграции БД
- ✅ Проверит здоровье приложения

### Способ 2: Ручной запуск

```bash
# Запустить контейнеры
docker compose -f docker-compose.prod.yml up -d

# Подождать 10 секунд, пока БД инициализируется
sleep 10

# Выполнить миграции
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

---

## ✅ Проверка

### Проверка 1: Статус контейнеров

```bash
docker compose -f docker-compose.prod.yml ps
```

Должно вывести:
```
NAME                    STATUS
assortiShop_db          Up (healthy)
assortiShop_backend     Up
```

### Проверка 2: Health Check

```bash
curl http://localhost:3000/api/health
```

Должен вернуть:
```json
{"status":"OK","timestamp":"2026-02-18T..."}
```

### Проверка 3: Получить продукты

```bash
curl http://localhost:3000/api/products
```

### Проверка 4: Просмотр логов

```bash
# Логи backend
docker compose -f docker-compose.prod.yml logs backend

# Логи БД
docker compose -f docker-compose.prod.yml logs postgres

# Логи в реальном времени (Ctrl+C для выхода)
docker compose -f docker-compose.prod.yml logs -f
```

### Проверка 5: Подключение к БД

```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop -c "SELECT COUNT(*) FROM products;"
```

---

## 🔄 Автозапуск

### Установка systemd сервиса

```bash
# Скопировать сервис файл
sudo cp assortiShop.service /etc/systemd/system/

# Перезагрузить systemd
sudo systemctl daemon-reload

# Включить автозапуск
sudo systemctl enable assortiShop.service

# Запустить сервис
sudo systemctl start assortiShop.service

# Проверить статус
sudo systemctl status assortiShop.service
```

### Проверка автозапуска

```bash
# Перезагрузить сервер
sudo reboot

# После перезагрузки проверить статус
sudo systemctl status assortiShop.service

# Проверить контейнеры
docker compose -f docker-compose.prod.yml ps
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

# Список контейнеров
docker ps -a
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

# Удалить контейнеры и образы
docker compose -f docker-compose.prod.yml down -v
```

### Просмотр логов

```bash
# Все логи
docker compose -f docker-compose.prod.yml logs

# Логи в реальном времени
docker compose -f docker-compose.prod.yml logs -f

# Только backend
docker compose -f docker-compose.prod.yml logs backend

# Только БД
docker compose -f docker-compose.prod.yml logs postgres

# Последние 100 строк
docker compose -f docker-compose.prod.yml logs --tail=100

# Логи systemd сервиса
sudo journalctl -u assortiShop.service -f
```

### Работа с БД

```bash
# Подключиться к БД
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop

# Список таблиц
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop -c "\dt"

# Количество продуктов
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop -c "SELECT COUNT(*) FROM products;"

# Резервная копия БД
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из резервной копии
docker compose -f docker-compose.prod.yml exec -T postgres psql -U assortiuser assortiShop < backup_20260218_120000.sql
```

### Systemd сервис

```bash
# Статус
sudo systemctl status assortiShop.service

# Запуск
sudo systemctl start assortiShop.service

# Остановка
sudo systemctl stop assortiShop.service

# Перезагрузка
sudo systemctl restart assortiShop.service

# Отключить автозапуск
sudo systemctl disable assortiShop.service

# Логи
sudo journalctl -u assortiShop.service -f

# Последние 50 строк логов
sudo journalctl -u assortiShop.service -n 50
```

---

## 🐛 Решение проблем

### Проблема 1: docker compose: command not found

```bash
sudo apt install -y docker-compose-plugin
docker compose version
```

### Проблема 2: Permission denied while trying to connect to Docker daemon

```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps
```

### Проблема 3: Port 3000 already in use

```bash
# Найти процесс на порту 3000
sudo lsof -i :3000

# Убить процесс (замените PID на реальный номер)
sudo kill -9 PID

# Или изменить порт в .env файле
nano .env
# Измените PORT=3000 на PORT=3001
docker compose -f docker-compose.prod.yml restart
```

### Проблема 4: Database connection refused

```bash
# Проверить статус БД
docker compose -f docker-compose.prod.yml ps postgres

# Посмотреть логи БД
docker compose -f docker-compose.prod.yml logs postgres

# Перезагрузить БД
docker compose -f docker-compose.prod.yml restart postgres

# Подождать 10 секунд
sleep 10

# Проверить здоровье
docker compose -f docker-compose.prod.yml ps
```

### Проблема 5: Миграции не применились

```bash
# Запустить миграции вручную
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate

# Или сгенерировать Prisma клиент
docker compose -f docker-compose.prod.yml exec backend npm run prisma:generate

# Проверить статус
docker compose -f docker-compose.prod.yml logs backend
```

### Проблема 6: Backend не запускается

```bash
# Посмотреть логи
docker compose -f docker-compose.prod.yml logs backend

# Пересобрать образ
docker compose -f docker-compose.prod.yml build --no-cache

# Перезагрузить
docker compose -f docker-compose.prod.yml up -d --build

# Проверить логи снова
docker compose -f docker-compose.prod.yml logs -f backend
```

### Проблема 7: Контейнеры не запускаются после перезагрузки

```bash
# Проверить статус systemd сервиса
sudo systemctl status assortiShop.service

# Посмотреть логи сервиса
sudo journalctl -u assortiShop.service -f

# Перезагрузить сервис
sudo systemctl restart assortiShop.service

# Проверить контейнеры
docker compose -f docker-compose.prod.yml ps
```

---

## 🔐 Безопасность

### Генерация сложного пароля

```bash
openssl rand -base64 32
```

### Firewall правила (UFW)

```bash
# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP
sudo ufw allow 80/tcp

# Разрешить HTTPS
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

### Резервная копия БД

```bash
# Создать резервную копию
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup_$(date +%Y%m%d_%H%M%S).sql

# Список резервных копий
ls -lh backup_*.sql

# Восстановить из резервной копии
docker compose -f docker-compose.prod.yml exec -T postgres psql -U assortiuser assortiShop < backup_20260218_120000.sql
```

---

## 📞 Быстрая помощь

### Что-то не работает?

```bash
# 1. Проверить логи
docker compose -f docker-compose.prod.yml logs

# 2. Проверить статус контейнеров
docker compose -f docker-compose.prod.yml ps

# 3. Проверить переменные окружения
cat .env

# 4. Перезагрузить контейнеры
docker compose -f docker-compose.prod.yml restart

# 5. Проверить health check
curl http://localhost:3000/api/health
```

### Нужна полная информация?

```bash
# Вывести всю информацию о системе
echo "=== Docker версия ===" && docker --version
echo "=== Docker Compose версия ===" && docker compose version
echo "=== Статус контейнеров ===" && docker compose -f docker-compose.prod.yml ps
echo "=== Использование ресурсов ===" && docker stats --no-stream
echo "=== Логи backend ===" && docker compose -f docker-compose.prod.yml logs --tail=20 backend
```

---

## ✨ Готово!

Ваш бэкенд развёрнут на Selectel! 🎉

**Проверьте:**
- API: `http://ВАШ_IP:3000/api/health`
- Документация: `http://ВАШ_IP:3000/api-docs`
- Продукты: `http://ВАШ_IP:3000/api/products`

---

**Дата создания:** 18 февраля 2026
**Версия:** 1.0
