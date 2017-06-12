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



var map = new HashMap('Deadline 1','2017-06-11T21:45','Deadline 2', '2017-06-19T17:53','Deadline 3' ,'2017-06-12T20:48');
 
cron.schedule('* * * * *', function(){
 var now = new Date();
 
 //TODO ?? first of sorted
 map.forEach(function(value, key) {
   // console.log(key + " : " + value);
    var date = new Date(value);
  if(now.getFullYear() == date.getFullYear()&&now.getMonth() == date.getMonth()&&now.getDay() == date.getDay()&&
     now.getHours() == date.getHours()&& now.getMinutes() == date.getMinutes())
     {
     console.log(key);

        bot.startConversation({
           // user: '@allochka',
            channel: 'C5K9XRGQ4',
        }, (err, convo) => {
            convo.say(key)
        });
     }

    /*var weekdate = new Day(date.getFullYear(),date.getMonth(),date.getDay());
    if(now.getFullYear() == weekdate.getFullYear()&&now.getMonth() == weekdate.getMonth()&&now.getDay() == weekdate.getDay())
    // now.getHours() == date.getHours()&& now.getMinutes() == date.getMinutes())//?? 
     {
     console.log('7 day left to deadline ' + key);

        bot.startConversation({
           // user: '@allochka',
            channel: 'C5K9XRGQ4',
        }, (err, convo) => {
            convo.say('7 day left to deadline ' + key)
        });
     }
*/
 // else 
   // console.log('Check in every minutes');

});
 
});


function deleteInvalidDate()
{
  map.forEach(function(value, key) {
    var date = new Date(value);
    if(!checkInvalidDate(date))
    map.remove(key);
  })
}



function checkInvalidDate(date)
{
  var now = new Date();
  
    if(now.getFullYear() > date.getFullYear())
    return false;
    
    if(now.getMonth() > date.getMonth())
    return false;

    if(now.getDay() > date.getDay())
    return false;
    
    if(now.getHours() > date.getHours())
    return false;
    
    if(now.getMinutes() > date.getMinutes())
    return false;

    return true;
 
}

function firstdate(){
  deleteInvalidDate();
  var array = map.values().sort();
  return array[0];
}

 

controller.hears(
  ['hello', 'hi', 'halo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Hello! I\'m notification bot!' ) })

  controller.hears(
  ['deadline'], ['direct_message'],
  function (bot, message) { bot.reply(message, map.search(firstdate()) + ' ' + (firstdate()).replace(/T/, ' ')) })


function printall()
{
  deleteInvalidDate();
  if(map.values == null) consol.log('No deadlines');
  //if(map == null) return 'No deadlines';
  var s=''
  map.forEach(function(value, key)
   {
    s+=key+' '+value.replace(/T/, ' ')+' \n'
  })
  return s;
}

  controller.hears(
  ['all'], ['direct_message'],
  function (bot, message) { bot.reply(message, printall() )})

  
  // delete deadLine
  
   controller.hears(
  ['delete'], ['direct_message'],
  function (bot, message) { 
      bot.startConversation(message,function(err,convo) {
 
    convo.addQuestion('Enter name of deadline you want to delete.',function(response,convo) {
        var namedelete = response.text
           //convo.say('Cool your deadline: ' + response.text);
         map.remove(namedelete);
           convo.next();  
    },
    {},'default');})})

//TODO validation
controller.hears(['add'],  [ 'direct_message'], function(bot,message) {

   var newname = ''
   var newdate = ''
   var newtime = ''
    
  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {
 
    convo.addQuestion('I heard that you want to add new deadline! So, enter name of your deadline.',function(response,convo) {
          
           newname = response.text
           convo.say('Cool your deadline: ' + response.text);
           convo.next();  

    },
    {},'default');

 convo.addQuestion('What date of your deadline? Format YYYY-MM-DD',function(response,convo) {
          
           newdate = response.text
           convo.say('Date: ' + response.text);
           convo.next();   

    },
    {},'default');

     convo.addQuestion('What about time?',function(response,convo) {
          
          newtime = response.text
           var newDateTime = newdate+'T'+newtime;
           if(!checkInvalidDate(new Date(newDateTime)) )
           { convo.say('Invalid date!Try again');
             //convo.repeat()
             convo.next()
           }
           else
           {
             map.set(newname, newDateTime);
             convo.say('Time: ' + response.text);
             convo.next();  
           } 

    },
    {},'default');



  })

});






  /*controller.hears(
  ['add'],
  [ 'direct_message'],
  function (bot, message) {
    bot.startConversation(message, function (err, convo) {
      if (err) {
        console.log(err)
        return
      }
      convo.ask('I heard that you want to add new deadline! So, enter name of your deadline.',[
        {
          pattern: '[a-z]+',
          callback: function (response, convo) {
            convo.say('Great!')
            var newname = response;
            convo.next()
            convo.ask('What date of your deadline? Format YYYY-MM-DD', [
              {
                pattern: '^(\d{4})-(\d{1,2})-(\d{1,2})$',
                callback: function (response, convo) {
                  var newdate = response;
                  convo.next()

                 convo.ask('What about time?', [
              {
                //pattern: '[0-9]+',
                callback: function (response, convo) {
                  convo.say('I added your deadline !')
                  var newtime = response;
                }
                  }])

                }
              }])

          }
        }])
    })
  })
*/

                 
          

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