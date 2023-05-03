require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const text_data = require("./modules/text_data");
const my_functions = require("./modules/my_functions");
const mongo = require("./modules/mongo");

const express = require('express');
const config = require('config');


const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

let currentMode = null;
const course = 100 / 60; // 100G/60rub

function startBot() {
  mongo.connectToMongoDB();

  bot.onText(text_data.textCommand.start, (message) => {
    mongo.login(message.from);
    my_functions.send(
      bot,
      message,
      text_data.messageList.start,
      text_data.buttons
    );
  });

  bot.on("message", async (message) => {
    console.log(
      message.from.username,
      " | ",
      message.from.first_name,
      " | ",
      message.text
    );
    if (currentMode === "replenish_balance") {
      if (Number(message.text)) {
        currentMode = null;

        if (Number(message.text) < 100) {
          return my_functions.send(
            bot,
            message,
            text_data.messageList.minimum_deposit_amount
          );
        }

        return my_functions.send(
          bot,
          message,
          text_data.messageList.replenish_balance(Number(message.text), course),
          text_data.propsList.replenish_balance
        );
      }
      currentMode = null;
    }

    if (currentMode === "support_question") {
      currentMode = null;
      if (
        !Object.keys(text_data.textCommand).includes(message.text) &&
        !Object.keys(text_data.messageList).includes(message.text)
      ) {
        const response_message = await my_functions.sendSupportQuestion(
          message.from.id,
          message.text
        );
        return my_functions.send(bot, message, response_message);
      }
    }

    if (message.text === "💲 Пополнить баланс") {
      currentMode = "replenish_balance";
    } else {
      currentMode = null;
    }

    if (my_functions.checkIsUnidentified(message.text)) {
      if (
        Object.keys(text_data.messageList).includes(message.text) &&
        !Object.keys(text_data.textCommand).includes(message.text)
      ) {
        const functionMessageList = [
          "👤 Профиль",
          "🍯 Купить голду",
          "📨 Вывод",
        ];

        if (functionMessageList.includes(message.text)) {
          return my_functions.send(
            bot,
            message,
            await text_data.messageList[message.text](message.from),
            text_data.propsList[message.text] || {}
          );
        }
        return my_functions.send(
          bot,
          message,
          text_data.messageList[message.text],
          text_data.propsList[message.text] || {}
        );
      }
      return my_functions.send(
        bot,
        message,
        text_data.messageList.dontunderstand
      );
    }
    return my_functions.send(
      bot,
      message,
      text_data.messageList.dontunderstand
    );
  });

  bot.on("callback_query", (message) => {
    bot.deleteMessage(message.message.chat.id, message.message.message_id);

    switch (message.data) {
      case "💲 Пополнить баланс":
        currentMode = "replenish_balance";
        return my_functions.send(
          bot,
          message,
          text_data.messageList.replenish_balance,
          text_data.propsList.replenish_balance
        );

      case "replenish_balance_kivi":
        console.log(message);
        return my_functions.send(
          bot,
          message,
          text_data.messageList.replenish_balance_kivi(
            message.message.text.split(" ")[2]
          )
        );
      case "replenish_balance_sber":
        return my_functions.send(
          bot,
          message,
          text_data.messageList.replenish_balance_sber(
            message.message.text.split(" ")[2]
          ),
          text_data.propsList.replenish_balance_sber
        );
      case "replenish_balance_tinkoff":
        return my_functions.send(
          bot,
          message,
          text_data.messageList.replenish_balance_tinkoff(
            message.message.text.split(" ")[2]
          ),
          text_data.propsList.replenish_balance_tinkoff
        );
      case "back_to_support":
        return my_functions.send(
          bot,
          message,
          text_data.messageList["🧑‍💻 Поддержка"],
          text_data.propsList["🧑‍💻 Поддержка"]
        );

      case "support_question":
        currentMode = "support_question";
        return my_functions.send(
          bot,
          message,
          text_data.messageList.support_question
        );

      default:
        if (Object.keys(text_data.messageList).includes(message.data)) {
          return my_functions.send(
            bot,
            message,
            text_data.messageList[message.data],
            text_data.propsList[message.data] || {}
          );
        }
        break;
    }
  });
}

startBot();

// SERVER
function startServer() {
  const app = express()
  const PORT = process.env.PORT || config.get("PORT")
  
  app.get("*", (_req, res) => {
    res.end("Bot start")
  })
  
  app.listen(PORT, () => console.log(`Server start on port ${PORT}`))
  
}
startServer();
