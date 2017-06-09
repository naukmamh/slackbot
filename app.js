var Botkit = require('botkit')


var token = 'xoxb-192818834532-DrpYX4YU71UC0ZcKZMO4QsDP'
//var port = process.env.PORT || 5000;
var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

var cron = require('node-cron');
 

// Assume single team mode if we have a SLACK_TOKEN
//if (token) {
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



var x =  function (bot, message) {
  bot.say(
  {
    text: 'my message text',
    channel: 'C5K9XRGQ4' // a valid slack channel, group, mpim, or im ID
  })
}

//1995, 11, 17, 3, 24, 0

//var date = new  Date(2017,9,6,21,6);
cron.schedule('* * * * *', function(){
  //var now = new Date();
  //var now2 = new Date(now.getFullYear,now.getMonth, now.getDay, now.getHours, now.getMinutes)

  //if(now.getFullYear == date.getFullYear&&now.getMonth == date.getMonth&&now.getDay == date.getDay&&now.getHours == date.getHours&&now.getMinutes == date.getMinutes)
  console.log('Every minute');
  //else console.log('Check in every minutes');
 
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
            text: 'WOWZA... 1....2'
        }, (err, convo) => {
            convo.say('This is the shit')
        });
    })


// Send the user who added the bot to their team a welcome message the first time it's connected

 
});

var now = new Date();
controller.hears(
  ['hello', 'hi', 'halo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Current date = ' + now) })
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