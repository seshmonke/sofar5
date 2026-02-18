# 📋 Резюме развёртывания на Selectel

Полный список созданных файлов и инструкций для развёртывания бэкенда и БД на облачном сервере Selectel.

## 📁 Созданные файлы

### 1. **SELECTEL_DEPLOYMENT.md** (Главное руководство)
   - 📖 Полное пошаговое руководство
   - 🔧 Все этапы развёртывания
   - 🐛 Решение проблем
   - 🔐 Рекомендации по безопасности
   - 📊 Полезные команды

### 2. **QUICK_START_SELECTEL.md** (Быстрый старт)
   - ⚡ За 5 минут
   - ✅ Чек-лист
   - 🔧 Основные команды
   - 🆘 Частые проблемы

### 3. **backend/docker-compose.prod.yml** (Production конфигурация)
   - 🐳 Docker Compose для production
   - ♻️ Автоперезагрузка контейнеров
   - 📊 Логирование
   - 🏥 Health checks

### 4. **backend/.env.production** (Шаблон переменных окружения)
   - 🔐 Переменные для production
   - 📝 Комментарии с инструкциями
   - ⚠️ Требует редактирования перед использованием

### 5. **backend/deploy.sh** (Автоматический скрипт развёртывания)
   - 🚀 Полностью автоматизированное развёртывание
   - ✅ Проверка всех шагов
   - 📊 Красивый вывод с цветами
   - 🔍 Проверка здоровья приложения

### 6. **backend/assortiShop.service** (Systemd сервис)
   - 🔄 Автозапуск при перезагрузке сервера
   - 📝 Логирование в systemd journal
   - 🔧 Автоматический перезапуск при ошибке

## 🚀 Пошаговое развёртывание

### Этап 1: Подготовка (на локальной машине)
```bash
# Убедитесь, что все файлы закоммичены в git
git add .
git commit -m "Add Selectel deployment files"
git push
```

### Этап 2: На сервере Selectel

**Шаг 1: Подключитесь к серверу**
```bash
ssh root@ВАШ_IP_АДРЕС
cd ~/sofar5
git pull  # Получите новые файлы
cd backend
```

**Шаг 2: Исправьте Docker (если нужно)**
```bash
sudo apt remove docker-compose -y
sudo apt update
sudo apt install -y docker-compose-plugin
docker compose version
```

**Шаг 3: Подготовьте .env файл**
```bash
cp .env.production .env
nano .env  # Отредактируйте значения
```

**Шаг 4: Запустите развёртывание**

Вариант A (РЕКОМЕНДУЕТСЯ - автоматический):
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

Вариант B (ручной):
```bash
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

**Шаг 5: Проверьте**
```bash
curl http://localhost:3000/api/health
docker compose -f docker-compose.prod.yml ps
```

### Этап 3: Настройка автозапуска (опционально)

```bash
sudo cp assortiShop.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable assortiShop.service
sudo systemctl start assortiShop.service
sudo systemctl status assortiShop.service
```

## 📊 Структура файлов

```
version-five/
├── SELECTEL_DEPLOYMENT.md              # Полное руководство
├── QUICK_START_SELECTEL.md             # Быстрый старт
├── SELECTEL_DEPLOYMENT_SUMMARY.md      # Этот файл
│
└── backend/
    ├── docker-compose.prod.yml         # Production конфигурация
    ├── .env.production                 # Шаблон переменных
    ├── deploy.sh                       # Скрипт развёртывания
    ├── assortiShop.service             # Systemd сервис
    │
    ├── docker/
    │   └── Dockerfile                  # Docker образ
    │
    ├── prisma/
    │   └── schema.prisma               # Схема БД
    │
    └── src/
        └── ...                         # Исходный код
```

## 🔑 Ключевые переменные окружения

| Переменная | Значение | Примечание |
|-----------|---------|-----------|
| `DB_USER` | `assortiuser` | Пользователь БД |
| `DB_PASSWORD` | `CHANGE_ME...` | ⚠️ Установите сложный пароль |
| `DB_NAME` | `assortiShop` | Имя БД |
| `NODE_ENV` | `production` | Production режим |
| `PORT` | `3000` | Порт бэкенда |
| `API_URL` | `http://YOUR_IP:3000` | ⚠️ Замените на ваш IP/домен |
| `FRONTEND_URL` | `http://YOUR_IP:5173` | ⚠️ Замените на ваш IP/домен |

## 🔧 Полезные команды

### Просмотр статуса
```bash
# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Статус systemd сервиса
sudo systemctl status assortiShop.service
```

### Управление контейнерами
```bash
# Запуск
docker compose -f docker-compose.prod.yml up -d

# Остановка
docker compose -f docker-compose.prod.yml down

# Перезагрузка
docker compose -f docker-compose.prod.yml restart

# Пересборка
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d --build
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
```

### Работа с БД
```bash
# Подключение к БД
docker compose -f docker-compose.prod.yml exec postgres psql -U assortiuser -d assortiShop

# Резервная копия
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup.sql

# Восстановление
docker compose -f docker-compose.prod.yml exec -T postgres psql -U assortiuser assortiShop < backup.sql
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

# Логи
sudo journalctl -u assortiShop.service -f
```

## 🐛 Решение проблем

### Проблема: docker compose: command not found
```bash
sudo apt install -y docker-compose-plugin
```

### Проблема: Permission denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Проблема: Port 3000 already in use
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

### Проблема: Database connection refused
```bash
docker compose -f docker-compose.prod.yml logs postgres
docker compose -f docker-compose.prod.yml restart postgres
```

### Проблема: Миграции не применились
```bash
docker compose -f docker-compose.prod.yml exec backend npm run prisma:migrate
```

### Проблема: Backend не запускается
```bash
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d --build
```

## 🔐 Рекомендации по безопасности

1. ✅ **Используйте сложные пароли** для БД
   ```bash
   openssl rand -base64 32
   ```

2. ✅ **Ограничьте доступ к портам** через firewall
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. ✅ **Используйте HTTPS** для production (nginx + Let's Encrypt)

4. ✅ **Регулярно обновляйте** Docker образы
   ```bash
   docker pull postgres:16-alpine
   docker compose -f docker-compose.prod.yml build --no-cache
   ```

5. ✅ **Делайте резервные копии** БД
   ```bash
   docker compose -f docker-compose.prod.yml exec postgres pg_dump -U assortiuser assortiShop > backup_$(date +%Y%m%d).sql
   ```

## 📞 Поддержка

Если возникли проблемы:

1. 📖 Прочитайте `SELECTEL_DEPLOYMENT.md` (полное руководство)
2. 🔍 Проверьте логи: `docker compose -f docker-compose.prod.yml logs`
3. ✅ Убедитесь, что Docker запущен: `docker ps`
4. 📝 Проверьте переменные окружения: `cat .env`
5. 🔄 Перезагрузите контейнеры: `docker compose -f docker-compose.prod.yml restart`

## 📚 Дополнительные ресурсы

- [Docker документация](https://docs.docker.com/)
- [Docker Compose документация](https://docs.docker.com/compose/)
- [PostgreSQL документация](https://www.postgresql.org/docs/)
- [Prisma документация](https://www.prisma.io/docs/)
- [Express.js документация](https://expressjs.com/)

## ✨ Готово!

Ваш бэкенд и БД развёрнуты на Selectel и готовы к работе! 🎉

**Полезные ссылки:**
- API документация: `http://ВАШ_IP:3000/api-docs`
- Health check: `http://ВАШ_IP:3000/api/health`
- Swagger UI: `http://ВАШ_IP:3000/api-docs`

---

**Дата создания:** 18 февраля 2026
**Версия:** 1.0
**Статус:** ✅ Готово к использованию
