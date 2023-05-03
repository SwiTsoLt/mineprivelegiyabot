const mongo = require("./mongo");
const text_data = require("./text_data");

function send(bot, message, text, props) {
  return (
    text &&
    bot.sendMessage(
      message.chat ? message.chat.id : message.message.chat.id,
      text,
      props
    )
  );
}

function checkIsUnidentified(text) {
  for (key in text_data.textCommand) {
    if (text_data.textCommand[key].test(text)) {
      return false;
    }
  }
  return true;
}

async function getProfileMessage(userInfo) {
  const user = await mongo.findUserById(userInfo.id);
  if (!user) {
    await mongo.login(userInfo);
    return getProfileMessage(userInfo);
  }
  return `📋 Информация о [${user.first_name}](t.me/${user.username})\n\nUID: \`${user._id}\`\n🆔: \`${user.id}\`\n💸 Денег: ${user.money} руб\n🍯 Золото: ${user.gold} G\n\n💵 Всего пополнено: на ${user.total_replenished} ₽\n🍯 Всего выведено: ${user.total_withdrawn} G`;
}

async function getBuyGoldMessage(userInfo) {
  const user = await mongo.findUserById(userInfo.id);
  if (!user) {
    await mongo.login(userInfo);
    return withdrgetBuyGoldMessageawal(userInfo);
  }
  if (!user.money) {
    return "❗️ На вашем балансе нету денег";
  }
  return "Типо купил голду";
}

async function withdrawal(userInfo) {
  const user = await mongo.findUserById(userInfo.id);
  if (!user) {
    await mongo.login(userInfo);
    return withdrawal(userInfo);
  }
  if (user.gold < 100) {
    return "❗️ Вывод работает от 100 голды.";
  }
  return "Типо вывел";
}

async function sendSupportQuestion(userInfo, message) {
  const user = await mongo.findUserById(userInfo.id);

  if (!user) {
    await mongo.login(userInfo);
    return sendSupportQuestion(userInfo, message);
  }

  const res = await mongo.createReview(userInfo, message)
  if (res.ownerId) {
    return "✅ Ваш вопрос был успешно отправлен"
  }
  return "🤷‍♂️ Что-то пошло не так..."
}

module.exports = {
  send,
  checkIsUnidentified,
  getProfileMessage,
  getBuyGoldMessage,
  withdrawal,
  sendSupportQuestion,
};
