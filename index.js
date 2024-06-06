require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.DUSIC_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: 'start',
    description: 'Запуск бота',
  },
  // {
  //   command: 'mood',
  //   description: 'Оценить настроение',
  // },
  // {
  //   command: 'share',
  //   description: 'Поделиться данными',
  // },
  // {
  //   command: 'inline_keyboard',
  //   description: 'Инлайн клавиатура',
  // },
  {
    command: 'menu',
    description: 'Получить меню',
  },
])

// Получить свой ID
// bot.hears('ID', async (ctx) => {
//   await ctx.reply(`Ваш telegram ID: ${ctx.from.id}`);
// })

bot.command('start', async (ctx) => {
  await ctx.react('❤‍🔥')
  await ctx.reply('Привет! Я - Дусик!', {
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true
  });
});

// bot.command('mood', async (ctx) => {
//   // первый способ создания клавиатуры
//   //const moodKeyboard = new Keyboard().text('Хорошо').row().text('Нормально').row().text('Плохо').resized()

//   // второй способ создания клавиатуры
//   const moodLabels = ['Хорошо', 'Нормально', 'Плохо']
//   const rows = moodLabels.map((label) => {
//     return [
//       Keyboard.text(label)
//     ]
//   })
//   const moodKeyboard2 = Keyboard.from(rows).resized()
//   await ctx.reply('Как настроение?', {
//     reply_markup: moodKeyboard2
//   })
// });

// bot.command('share', async (ctx) => {
//   const shareKeyboard = new Keyboard().requestLocation('Геолокация').requestContact('Контакт').requestPoll('Опрос').placeholder('Укажи данные...').resized()

//   await ctx.reply('Чем хочешь поделиться?', {
//     reply_markup: shareKeyboard
//   })
// })

// bot.on(':contact', async (ctx) => {
//   await ctx.reply('Спасибо за контакт!')
// })

// bot.hears('Хорошо', async (ctx) => {
//   await ctx.reply('Класс', {
//     reply_markup: { remove_keyboard: true }
//   })
// })

// bot.command('inline_keyboard', async (ctx) => {
//   // const inlineKeyboard = new InlineKeyboard()
//   //   .text('1', 'button-1').row()
//   //   .text('2', 'button-2').row()
//   //   .text('3', 'button-3');

//   const inlineKeyboard2 = new InlineKeyboard().url('Перейти в тг-канал', 'https://t.me/Roman_Padalitsa')
//   await ctx.reply('Нажмите кнопку', {
//     reply_markup: inlineKeyboard2
//   })
// });

// bot.callbackQuery(/button-[1-3]/, async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Вы выбрали кнопку: ${ctx.callbackQuery.data}`);
// });

// bot.on('callback_query:data', async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Вы выбрали кнопку: ${ctx.callbackQuery.data}`);
// })

const menuKeyboard = new InlineKeyboard()
  .text('Узнать статус заказа', 'order-status')
  .text('Обратиться в поддержку', 'support');
const backKeyboard = new InlineKeyboard()
  .text('<назад в меню', 'back')
bot.command('menu', async (ctx) => {
  await ctx.reply('Выберите пункт меню', {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery('order-status', async (ctx) => {
  await ctx.callbackQuery.message.editText('Статус заказа: в пути', {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('support', async (ctx) => {
  await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('back', async (ctx) => {
  await ctx.callbackQuery.message.editText('Выберите пункт меню', {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
