const mongo = require("./mongo");
const my_functions = require("./my_functions");

const textCommand = {
  start: /^(\/start)$/,
};

const messageList = {
  start:
    '🤖: 👋 Привет! Я — бот, твой виртуальный помощник по покупке голды. Для покупки выбери "Пополнить баланс".\nКурс: 60₽ - 100G\n💡Вся основная информация находится снизу, но если что-то не понятно, обращайся в поддержку.',
  dontunderstand: "Я вас не понял, нажмите /start",
  "💲 Пополнить баланс":
    "🤖: Чтобы купить голду, введите в чат сумму в рублях, на которую вы хотите пополнить. Например: 100\n💡 Необходимо ввести целое число, без копеек.",
  "🕹 Другие товары": "Упс, похоже здесь пусто :/",
  "🧑‍💻 Поддержка":
    "🧑‍💻 Часто задаваемые вопросы:\n\n1. Почему так долго проверяют чек?\n2. Почему так долго выводят золото?\n3. Сколько по времени выводят золото?\n4. Безопасно ли у вас покупать?\n\n💡 Прежде чем задать вопрос, убедитесь что здесь нету ответа на ваш вопрос",
  "📉 Курс": "Курс: 60₽ - 100G",
  "😄 Отзывы":
    "😄 Наши отзывы - t.me/GoldKingReviews\n\n💡 Если у вас есть какие-либо сомнения при покупке голды, то вы можете посмотреть отзывы и убедиться в нашей честности.",
  minimum_deposit_amount: "⚠️ Минимальная сумма для пополнения 100 рублей",
  "👤 Профиль": my_functions.getProfileMessage,
  "🍯 Купить голду": my_functions.getBuyGoldMessage,
  "📨 Вывод": my_functions.withdrawal,
  support_question: "📩 Напишите свой вопрос в поддержку",
  replenish_balance: (money, course) =>
    `💸 За ${money} рублей вы сможете купить ${Math.floor(
      money * course
    )} золота\n🖋 Выберите наиболее удобный для вас способ оплаты`,
  replenish_balance_kivi: (money) =>
    `🌐 Ссылка для оплаты: здесть должна быть ссылка\nПерейдите по ней, и оплатите баланс на ${money} рублей. В течении 10 минут.\n\n⚠️ Ваш баланс пополнится автоматически после оплаты!`,
  replenish_balance_sber: (money) =>
    `📩 Отправьте деньги на Сбербанк по реквизитам:\n💳 По номеру карты: \`номер карты\`\n💲 Сумма: ${money} ₽\n\n📷 Отправьте нам скриншот чека.`,
  replenish_balance_tinkoff: (money) =>
    `📩 Отправьте деньги на Тинькофф по реквизитам:\n💳 По номеру карты: \`номер карты\`\n💲 Сумма: ${money} ₽\n\n📷 Отправьте нам скриншот чека.`,
  support_1:
    "Чеки проверяются в ручную, а не автоматически. Сотрудники не смогут проверить чек, если вы пополнили в позднее время или раннее вечером. До 24 часов занимает проверка чека.",
  support_2:
    "Вывод золота занимает до 24 часов. Но мы стараемся как можно быстрее вывести вам золото. Возможно сотрудник взял перерыв или ваш скин трудно найти",
  support_3:
    "Вывод золота происходит до 24 часов от запроса на вывод. Но в большинстве вывод происходит от нескольких минут до часа.",
  support_4:
    "Весь товар, который продаётся в боте, получен честным путём. Если вы сомневаетесь в безопасности, то лучше покупать в игре.",
  "🧳 Кейсы": "Упс, похоже здесь пусто :/",
  "🎯 Игры": "Упс, похоже здесь пусто :/",
};

const propsList = {
  "🧑‍💻 Поддержка": {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "1", callback_data: "support_1" },
          { text: "2", callback_data: "support_2" },
          { text: "3", callback_data: "support_3" },
        ],
        [
          { text: "4", callback_data: "support_4" },
          { text: "✉️ Связаться", callback_data: "support_question" },
        ],
      ],
      resize_keyboard: true,
    },
  },
  "😄 Отзывы": {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "😄 Отзывы",
            callback_data: "reviews",
            url: "https://t.me/GoldKingReviews",
          },
        ],
      ],
    },
  },
  "👤 Профиль": { parse_mode: "MARKDOWN" },
  "🍯 Купить голду": {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Пополнить",
            callback_data: "💲 Пополнить баланс",
          },
        ],
      ],
    },
  },
  replenish_balance: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🥝 Киви (auto)",
            callback_data: "replenish_balance_kivi",
          },
        ],
        [
          {
            text: "🟢 Сбербанк",
            callback_data: "replenish_balance_sber",
          },
        ],
        [
          {
            text: "🔱 Тинькофф",
            callback_data: "replenish_balance_tinkoff",
          },
        ],
      ],
    },
  },
  replenish_balance_sber: { parse_mode: "MARKDOWN" },
  replenish_balance_tinkoff: { parse_mode: "MARKDOWN" },
  support_1: {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Назад", callback_data: "back_to_support" },
          { text: "✉️ Связаться", callback_data: "support_question" },
        ],
      ],
    },
  },
  support_2: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back_to_support",
          },
        ],
      ],
    },
  },
  support_3: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back_to_support",
          },
        ],
      ],
    },
  },
  support_4: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back_to_support",
          },
        ],
      ],
    },
  },
};

const buttons = {
  reply_markup: {
    keyboard: [
      ["💲 Пополнить баланс", "🍯 Купить голду", "📨 Вывод"],
      ["🧳 Кейсы", "🎯 Игры", "🕹 Другие товары"],
      ["🧑‍💻 Поддержка", "👤 Профиль", "📉 Курс"],
      ["😄 Отзывы"],
    ],
    resize_keyboard: true,
  },
};

module.exports = { textCommand, messageList, propsList, buttons };
