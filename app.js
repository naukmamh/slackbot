var Botkit = require('botkit')
var cron = require('node-cron');
var HashMap = require('hashmap');
 
var token = 'xoxb-192818834532-DrpYX4YU71UC0ZcKZMO4QsDP'
var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (!token) {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}
 // console.log('Starting in single-team mode')
 var bot =  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
//} else {
//  console.log('Starting in Beep Boop multi-team mode')
 // require('beepboop-botkit').start(controller, { debug: true })
//}


controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})



/*var x =  function (bot, message) {
  bot.say(
  {
    text: 'my message text',
    channel: 'C5K9XRGQ4' // a valid slack channel, group, mpim, or im ID
  })
}*/


//var date = new  Date('2017-06-10T20:33');
var map = new HashMap('2017-06-10T21:45','Deadline 1', '2017-06-10T21:48', 'Deadline 2','2017-06-10T20:48', 'Deadline 3');
 
cron.schedule('* * * * *', function(){
 var now = new Date();
 
 //TODO ?? first of sorted
 map.forEach(function(value, key) {
   // console.log(key + " : " + value);
    var date = new Date(key);
    if(now.getFullYear() == date.getFullYear()&&now.getMonth() == date.getMonth()&&now.getDay() == date.getDay()&&
     now.getHours() == date.getHours()&& now.getMinutes() == date.getMinutes())
     {
     console.log(value);

      bot.api.im.open({
        user: 'C5K9XRGQ4'
    }, (err, res) => {
        if (err) {
            bot.botkit.log('Failed to open IM with user', err)
        }
        console.log(res);
        bot.startConversation({
            user: 'C5K9XRGQ4',
            channel: 'C5K9XRGQ4',
        }, (err, convo) => {
            convo.say(value)
        });
    })
     }
  else 
    console.log('Check in every minutes');
});
 
});

function firstdate(){
  //TODO check with date now
  //
var array = map.keys().sort();
return array[0];
}

var dateToPrint = (firstdate()).replace(/T/, ' ');


controller.hears(
  ['hello', 'hi', 'halo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Hello! I\'m notification bot!' ) })

  controller.hears(
  ['deadline'], ['direct_message'],
  function (bot, message) { bot.reply(message, map.get(firstdate()) + ' ' + dateToPrint  ) })
/*
// START: listen for cat emoji delivery
var maxCats = 20
var catEmojis = [
  ':smile_cat:',
  ':smiley_cat:',
  ':joy_cat:',
  ':heart_eyes_cat:',
  ':smirk_cat:',
  ':kissing_cat:',
  ':scream_cat:',
  ':crying_cat_face:',
  ':pouting_cat:',
  ':cat:',
  ':cat2:',
  ':leopard:',
  ':lion_face:',
  ':tiger:',
  ':tiger2:'
]

controller.hears(
  ['cat', 'cats', 'kitten', 'kittens'],
  ['ambient', 'direct_message', 'direct_mention', 'mention'],
  function (bot, message) {
    bot.startConversation(message, function (err, convo) {
      if (err) {
        console.log(err)
        return
      }
      convo.ask('Does someone need a kitten delivery? Say YES or NO.', [
        {
          pattern: bot.utterances.yes,
          callback: function (response, convo) {
            convo.say('Great!')
            convo.ask('How many?', [
              {
                pattern: '[0-9]+',
                callback: function (response, convo) {
                  var numCats =
                  parseInt(response.text.replace(/[^0-9]/g, ''), 10)
                  if (numCats === 0) {
                    convo.say({
                      'text': 'Sorry to hear you want zero kittens. ' +
                        'Here is a dog, instead. :dog:',
                      'attachments': [
                        {
                          'fallback': 'Chihuahua Bubbles - https://youtu.be/s84dBopsIe4',
                          'text': '<https://youtu.be/s84dBopsIe4|' +
                            'Chihuahua Bubbles>!'
                        }
                      ]
                    })
                  } else if (numCats > maxCats) {
                    convo.say('Sorry, ' + numCats + ' is too many cats.')
                  } else {
                    var catMessage = ''
                    for (var i = 0; i < numCats; i++) {
                      catMessage = catMessage +
                      catEmojis[Math.floor(Math.random() * catEmojis.length)]
                    }
                    convo.say(catMessage)
                  }
                  convo.next()
                }
              },
              {
                default: true,
                callback: function (response, convo) {
                  convo.say(
                    "Sorry, I didn't understand that. Enter a number, please.")
                  convo.repeat()
                  convo.next()
                }
              }
            ])
            convo.next()
          }
        },
        {
          pattern: bot.utterances.no,
          callback: function (response, convo) {
            convo.say('Perhaps later.')
            convo.next()
          }
        },
        {
          default: true,
          callback: function (response, convo) {
            // Repeat the question.
            convo.repeat()
            convo.next()
          }
        }
      ])
    })
  })
  // END: listen for cat emoji delivery
  */