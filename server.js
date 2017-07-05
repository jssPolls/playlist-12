require('babel-register');

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var async = require('async');
var colors = require('colors');
var mongoose = require('mongoose');
var request = require('request');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var swig  = require('swig');
var xml2js = require('xml2js');
var _ = require('underscore');

var config = require('./config');
var routes = require('./app/routes');
var Character = require('./models/character');

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/characters', function(req, res, next) {
  var choices = ['Rock', 'Pop', 'Classical', 'Hip-Hop'];
  var randomGenre = _.sample(choices);

  Character.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .where('genre', randomGenre)
    .limit(6)
    .exec(function(err, characters) {
      if (err) return next(err);

      if (characters.length === 12) {
        return res.send(characters);
      }

      var oppositeGender = _.first(_.without(choices, randomGenre));

      Character
        .find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('genre', oppositeGender)
        .limit(6)
        .exec(function(err, characters) {
          if (err) return next(err);

          if (characters.length === 6) {
            return res.send(characters);
          }

          Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
            if (err) return next(err);
            res.send([]);
          });
        });
    });
});


/**
 * GET /api/characters
 * Returns 2 random characters of the male gender that have not been voted yet.
 */
app.get('/api/characters/rock', function(req, res, next) {
  var choices = ['Rock'];
  var randomGender = 'Male';

  Character.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .where('gender', 'Male')
    .limit(2)
    .exec(function(err, characters) {
      if (err) return next(err);

      if (characters.length === 2) {
        return res.send(characters);
      }

      var oppositeGender = 'Male';

      Character
        .find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', 'Male')
        .limit(2)
        .exec(function(err, characters) {
          if (err) return next(err);

          if (characters.length === 2) {
            return res.send(characters);
          }

          Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
            if (err) return next(err);
            res.send([]);
          });
        });
    });
});


/**
 * GET /api/characters
 * Returns 2 random characters of the female gender that have not been voted yet.
 */
app.get('/api/characters/females', function(req, res, next) {
  var choices = ['Female'];
  var randomGender = 'Female';

  Character.find({ random: { $near: [Math.random(), 0] } })
    .where('voted', false)
    .where('gender', 'Female')
    .limit(2)
    .exec(function(err, characters) {
      if (err) return next(err);

      if (characters.length === 2) {
        return res.send(characters);
      }

      var oppositeGender = 'Female';

      Character
        .find({ random: { $near: [Math.random(), 0] } })
        .where('voted', false)
        .where('gender', 'Female')
        .limit(2)
        .exec(function(err, characters) {
          if (err) return next(err);

          if (characters.length === 2) {
            return res.send(characters);
          }

          Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
            if (err) return next(err);
            res.send([]);
          });
        });
    });
});




/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
app.put('/api/characters', function(req, res, next) {
  var winner = req.body.winner;
  var loser = req.body.loser;

  if (!winner || !loser) {
    return res.status(400).send({ message: 'Voting requires two characters.' });
  }

  if (winner === loser) {
    return res.status(400).send({ message: 'Cannot vote for and against the same character.' });
  }

  async.parallel([
      function(callback) {
        Character.findOne({ characterId: winner }, function(err, winner) {
          callback(err, winner);
        });
      },
      function(callback) {
        Character.findOne({ characterId: loser }, function(err, loser) {
          callback(err, loser);
        });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      var winner = results[0];
      var loser = results[1];

      if (!winner || !loser) {
        return res.status(404).send({ message: 'One of the characters no longer exists.' });
      }

      if (winner.voted || loser.voted) {
        return res.status(200).end();
      }

      async.parallel([
        function(callback) {
          winner.wins++;
          var dif = 0;
          var det = winner.rating/400;
          var de = loser.rating/400;
          var ra = Math.pow(10, det);
          var rb = Math.pow(10, de);
          var rc = ra + rb ;
          var ea = ra/rc;
          var eb = rb/rc;
          winner.rating = winner.rating + (2*(1-ea));
          loser.rating = loser.rating - (2*eb);
          winner.voted = true;
          winner.random = [Math.random(), 0];
          winner.save(function(err) {
            callback(err);
          });
        },
        function(callback) {
          loser.losses++;
          loser.voted = true;
          loser.random = [Math.random(), 0];
          loser.save(function(err) {
            callback(err);
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.status(200).end();
      });
    });
});

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function(req, res, next) {
  Character
    .find()
    .sort('-losses')
    .limit(100)
    .exec(function(err, characters) {
      if (err) return next(err);
      res.send(characters);
    });
});

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
  var params = req.query;
  var conditions = {};

  _.each(params, function(value, key) {
    conditions[key] = new RegExp('^' + value + '$', 'i');
  });

  Character
    .find(conditions)
    .sort('-wins')
    .limit(500)
    .exec(function(err, characters) {
      if (err) return next(err);

      characters.sort(function(a, b) {
//         if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) { return 1; }
//         if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) { return -1; }
        if (a.rating < b.rating) { return 1; }
        if (a.rating > b.rating) { return -1;}
        return 0;
      });

      res.send(characters);
    });
});

/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
app.get('/api/characters/count', function(req, res, next) {
  Character.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function(req, res, next) {
  var characterName = new RegExp(req.query.name, 'i');

  Character.findOne({ name: characterName }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});

/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
app.get('/api/characters/:id', function(req, res, next) {
  var id = req.params.id;

  Character.findOne({ characterId: id }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    res.send(character);
  });
});

/**
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {
  var characterName = req.body.name;
  var characterGenre = req.body.genre;
  var characterArtist = req.body.artist;
  var characterUrl = req.body.url;
  var rating = 10;
  var characterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=' + characterName;

  var parser = new xml2js.Parser();

  async.waterfall([
    function(callback) {
      request.get(characterIdLookupUrl, function(err, request, xml) {
        if (err) return next(err);
        parser.parseString(xml, function(err, parsedXml) {
          if (err) return next(err);
          try {
            var characterId = characterName;

            Character.findOne({ name: characterName }, function(err, character) {
              if (err) return next(err);

              if (character) {
                return res.status(409).send({ message: character.name + ' is already in the database.' });
              }

              callback(err, characterId);
            });
          } catch (e) {
            return res.status(400).send({ message: 'XML Parse Error' });
          }
        });
      });
    },
    function(characterId) {
      var characterInfoUrl = 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=' + characterId;
      
             var name = characterName;
            //var race = parsedXml.eveapi.result[0].race[0];
            var genre = characterGenre;
            var artist = characterArtist;
            var url = characterUrl;
            //16var bloodline = parsedXml.eveapi.result[0].bloodline[0];

            var character = new Character({
              characterId: name,
              name: name,
              artist: artist,
              genre: genre,
              url: url,
              rating: rating,
              random: [Math.random(), 0]
            });

            character.save(function(err) {
              if (err) return next(err);
              res.send({ message: characterName + ' has been added successfully!' });
            });

//       request.get({ url: characterInfoUrl }, characterName, characterYear, characterBranch, function(err, request, xml) {
//         if (err) return next(err);
//         parser.parseString(xml, function(err, parsedXml) {
//           if (err) return res.send(err);
//           try {
//             var name = characterName;
//             //var race = parsedXml.eveapi.result[0].race[0];
//             var year = characterYear;
//             var branch = characterBranch;
//             //16var bloodline = parsedXml.eveapi.result[0].bloodline[0];

//             var character = new Character({
//               characterId: name,
//               name: name,
//               year: year,
//               gender: gender,
//               random: [Math.random(), 0]
//             });

//             character.save(function(err) {
//               if (err) return next(err);
//               res.send({ message: characterName + ' has been added successfully!' });
//             });
//           } catch (e) {
//             res.status(404).send({ message: characterName + ' is not a registered citizen of New Eden.' });
// //                         var name = characterName;
// //             var race = parsedXml.eveapi.result[0].race[0];
// //             var year = characterYear;
// //             var branch = characterBranch;
// //             var bloodline = parsedXml.eveapi.result[0].bloodline[0];

// //             var character = new Character({
// //               characterId: characterId,
// //               name: name,
// //               year: year,
// //               gender: gender,
// //               random: [Math.random(), 0]
// //             });

// //             character.save(function(err) {
// //               if (err) return next(err);
// //               res.send({ message: characterName + ' has been added successfully!' });
// //            });
//           }
//         });
//       });
    }
  ]);
});

/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function(req, res, next) {
  async.parallel([
      function(callback) {
        Character.count({}, function(err, count) {
          callback(err, count);
        });
      },
      function(callback) {
        Character.count({ genre: 'Rock' }, function(err, rockCount) {
          callback(err, rockCount);
        });
      },
      function(callback) {
        Character.count({ genre: 'Pop' }, function(err, popCount) {
          callback(err, popCount);
        });
      },
      function(callback) {
        Character.count({ genre: 'Hip-Hop' }, function(err, hipCount) {
          callback(err, hipCount);
        });
      },
      function(callback) {
        Character.count({ genre: 'Bollywood' }, function(err, bollywoodCount) {
          callback(err, bollywoodCount);
        });
      },
      function(callback) {
        Character.count({ genre: 'Classical' }, function(err, maleCount) {
          callback(err, maleCount);
        });
      },
      function(callback) {
        Character.count({ genre: 'Female' }, function(err, classicalCount) {
          callback(err, classicalCount);
        });
      },
      function(callback) {
        Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err, totalVotes) {
            var total = totalVotes.length ? totalVotes[0].total : 0;
            callback(err, total);
          }
        );
      },
      function(callback) {
        Character
          .find()
          .sort('-wins')
          .limit(200)
          .select('race')
          .exec(function(err, characters) {
            if (err) return next(err);

            var raceCount = _.countBy(characters, function(character) { return character.race; });
            var max = _.max(raceCount, function(race) { return race });
            var inverted = _.invert(raceCount);
            var topRace = inverted[max];
            var topCount = raceCount[topRace];

            callback(err, { race: topRace, count: topCount });
          });
      },
      function(callback) {
        Character
          .find()
          .sort('-wins')
          .limit(100)
          .select('bloodline')
          .exec(function(err, characters) {
            if (err) return next(err);

            var bloodlineCount = _.countBy(characters, function(character) { return character.bloodline; });
            var max = _.max(bloodlineCount, function(bloodline) { return bloodline });
            var inverted = _.invert(bloodlineCount);
            var topBloodline = inverted[max];
            var topCount = bloodlineCount[topBloodline];

            callback(err, { bloodline: topBloodline, count: topCount });
          });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      res.send({
        totalCount: results[0],
        amarrCount: results[1],
        caldariCount: results[2],
        gallenteCount: results[3],
        minmatarCount: results[4],
        maleCount: results[5],
        femaleCount: results[6],
        totalVotes: results[7],
        leadingRace: results[8],
        leadingBloodline: results[9]
      });
    });
});


/**
 * POST /api/report
 * Reports a character. Character is removed after 4 reports.
 */
app.post('/api/report', function(req, res, next) {
  var characterId = req.body.characterId;

  Character.findOne({ characterId: characterId }, function(err, character) {
    if (err) return next(err);

    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    character.reports++;

    if (character.reports > 50) {
      character.remove();
      return res.send({ message: character.name + ' has been deleted.' });
    }

    character.save(function(err) {
      if (err) return next(err);
      res.send({ message: character.name + ' has been reported.' });
    });
  });
});

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
        var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
        var page = swig.renderFile('views/index.html', { html: html });
        res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack.red);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
