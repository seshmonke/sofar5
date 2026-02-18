# ⚡ Быстрый старт развёртывания на Selectel

Краткое руководство для быстрого развёртывания бэкенда и БД на Selectel.

## 🎯 За 5 минут

### Шаг 1: Подключитесь к серверу
```bash
ssh root@ВАШ_IP_АДРЕС
cd ~/sofar5/backend
```

### Шаг 2: Исправьте Docker (если нужно)
```bash
sudo apt remove docker-compose -y
sudo apt update
sudo apt install -y docker-compose-plugin
docker compose version  # Проверьте версию
```

### Шаг 3: Создайте .env файл
```bash
cp .env.production .env
# Отредактируйте .env и установите:
# - DB_PASSWORD (сложный пароль)
# - API_URL (ваш IP или домен)
# - FRONTEND_URL (ваш IP или домен)
nano .env
```

### Шаг 4: Запустите развёртывание
```bash
# Способ 1: Автоматический скрипт (РЕКОМЕНДУЕТСЯ)
chmod +x deploy.sh
sudo ./deploy.sh

# Способ 2: Ручной запуск
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

### Шаг 5: Проверьте
```bash
curl http://localhost:3000/api/health
```

Должен вернуть:
```json
{"status":"OK","timestamp":"..."}
```

## ✅ Чек-лист

- [ ] Подключились к серверу по SSH
- [ ] Исправили Docker Compose (установили V2)
- [ ] Создали .env файл с правильными значениями
- [ ] Запустили `docker compose -f docker-compose.prod.yml up -d`
- [ ] Запустили миграции: `docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate`
- [ ] Проверили health check: `curl http://localhost:3000/api/health`
- [ ] Проверили логи: `docker compose -f docker-compose.prod.yml logs`

## 🔧 Полезные команды

```bash
# Просмотр статуса
docker compose -f docker-compose.prod.yml ps

# Просмотр логов
docker compose -f docker-compose.prod.yml logs -f

# Остановка
docker compose -f docker-compose.prod.yml down

# Перезагрузка
docker compose -f docker-compose.prod.yml restart

# Подключение к БД
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop
```

## 🔄 Автозапуск при перезагрузке

```bash
# Установите systemd сервис
sudo cp assortiShop.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable assortiShop.service
sudo systemctl start assortiShop.service

# Проверьте статус
sudo systemctl status assortiShop.service
```

## 📚 Полная документация

Для подробного руководства смотрите: `SELECTEL_DEPLOYMENT.md`

## 🆘 Проблемы?

1. **docker compose: command not found**
   ```bash
   sudo apt install -y docker-compose-plugin
   ```

2. **Permission denied**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Port 3000 already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID
   ```

4. **Database connection refused**
   ```bash
   docker compose -f docker-compose.prod.yml logs postgres
   docker compose -f docker-compose.prod.yml restart postgres
   ```

## 🎉 Готово!

Ваш бэкенд работает на `http://ВАШ_IP:3000`

API документация: `http://ВАШ_IP:3000/api-docs`
