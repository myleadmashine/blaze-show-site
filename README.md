# BLAZE SHOW — сайт и публикация

**Репозиторий:** https://github.com/myleadmashine/blaze-show-site  
**Адрес сайта после успешного деплоя:** https://myleadmashine.github.io/blaze-show-site/

## Как устроена публикация
Сжатые исходники сайта находятся в каталоге `deploy-parts/`. GitHub Actions объединяет их, декодирует архив XZ, распаковывает в `site/` и публикует GitHub Pages. Каждый push в `main` запускает новую публикацию.

## Включить GitHub Pages (один раз)
1. Открыть **Settings → Pages**.
2. В разделе **Build and deployment** выбрать **Source: GitHub Actions**.
3. Открыть вкладку **Actions** и проверить workflow **Deploy BLAZE SHOW to GitHub Pages**.
4. После зелёного статуса Deploy открыть адрес сайта выше.

## Содержание сайта
После распаковки архива:
- `index.html` — лендинг, три пакета и квиз.
- `assets/css/styles.css` — стили и адаптивная верстка.
- `assets/js/app.js` — логика квиза, отправки заявки и событий аналитики.
- `assets/js/config.js` — единые настройки.
- `assets/media/blaze-logo.webp` — логотип BLAZE SHOW.
- `privacy.html` — черновик политики конфиденциальности.
- `MEDIA-INDEX.html` — ссылки на переданные медиа-материалы.

## Пакеты
- **BLAZE MOMENT — 375 000 ₸:** три танцевальных номера по 125 000 ₸.
- **BLAZE SIGNATURE — 750 000 ₸:** четыре батыра, эффектный выход кудалар и сопровождение; два оплачиваемых танцевальных номера на 250 000 ₸ и третий номер бонусом. Батыры отдельно не продаются.
- **BLAZE CELEBRATION — от 2 500 000 ₸:** программа под ключ, окончательный состав и смета согласуются индивидуально.

## Перед рекламой заполнить assets/js/config.js
Внутри архива укажите:
- подтверждённые телефон и WhatsApp;
- действующий email;
- Cloudflare Worker endpoint для доставки заявок;
- реальные ID Google Analytics 4, Google Ads, Яндекс Метрики и Microsoft Clarity.

**Важно:** без endpoint квиз формирует резюме, но не доставляет заявку продюсеру. Не публикуйте рекламу с обещанием онлайн-отправки, пока не проверите реальную запись тестовой заявки в Google Sheets и получение уведомления.

## Видео
На сайте используются Wistia media ID: `4nnek73dvf`, `sx1i8mpjne`, `7bjmxjnqsf`, `nwstr5fcgl`; YouTube-плейлист: `PLwggEGZ-DYyUGoH1fVzrmDOkTe02Rk8_x`. В Wistia при необходимости разрешите встраивание с домена GitHub Pages.

## Как обновить сайт
Сформируйте новый XZ-архив структуры сайта, закодируйте его в base64, замените тексты `deploy-parts/part-01.txt` ... `part-05.txt` и отправьте изменения в `main`. Workflow автоматически распакует новую сборку.
