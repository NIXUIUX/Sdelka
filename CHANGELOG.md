# Изменения

Формат: [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [SemVer](https://semver.org/lang/ru/).
До 1.0 названия и параметры компонентов могут меняться в минорных версиях (0.x.0) — такие изменения помечены «Ломает».

## 0.1.0 — 2026-11-13

Первый выпуск. Сверено с прототипом флоу Б.

### Основа
- Токены «Мягко» (цвета, радиусы, тени, отступы) — CSS-переменные, тема Tailwind v4, JSON и TS
- Типографика Geist: 14 текстовых стилей
- 37 иконок (пути из прототипа), компонент `Icon`
- Утилиты: маски полей, валидаторы с текстами из прототипа, `errorSummary`, `focusFirstError`, форматирование сумм, расчёт платежа

### Компоненты
- Кнопки и метки: `Button`, `Badge`, `Avatar`, `AvatarGroup`, `Spinner`
- Поля: `Input`, `MoneyField`, `Textarea`, `Select`, `SearchField`, `StepperField`, `MiniStepper`
- Выбор: `Checkbox`, `RadioGroup`, `Switch`, `ChoiceGroup`, `Chip`, `FilterChip`
- Навигация: `LineTabs`, `TextTabs`, `SegmentedTabs`, `StepsNav`, `HSteps`, `Popover`, `Menu`, `FilterPanel`
- Сообщения: `Alert`, `Toast` + `useToast`, `Modal`, `LoadingState`
- Файлы: `UploadZone`, `FileItem`
- `Checkbox locked` — светло-голубой квадрат с белой галочкой, как в Figma; `ApprovedParams defaultEditing` — открыть сразу в режиме правки
- Каркас страницы: `Container`, `AppHeader`, `FlowHead`, `PageLayout`, `Card`, `FormGrid`, `Inset`, `BottomBar`, `Autosave`, `HelpCard` и др.

### Паттерны флоу
- Подбор банков: `BankRow`, `PickedBanks`, `Metric`, `CreditParams`, `ApprovedParams`
- Прескоринг: `ScoreCard`, `ScoreBadge`, `ScorePill`, `Participant`, `SignalGrid`, `ReportSection`
- Статусы и переписка: `StatusBankCard`, `MailItem`, `BankReply`, `MailCompose`, `DealsTable`
- Подписание и клиент: `SignerHeader`, `DocBox`, `SignaturePad`, `PackageCard`, `ClientHero`, `BrokerContact`
- Письмо клиенту: `OfferLetter`, `MailPreview`, иллюстрации `HouseIllustration` и `DocsIllustration` (состояния upload / sent / waiting)

### Storybook
- «Экраны / Сценарии»: 71 состояние флоу Б по секциям Figma — заявки, подбор, окна, прескоринг, анкета 1.1–1.4, статус в банках, короткий флоу Сбербанка, страница клиента

### Совместимость
- React 18 и 19 (проверено на 18.3 и 19.3), ESM-сборка, типы TypeScript в комплекте
