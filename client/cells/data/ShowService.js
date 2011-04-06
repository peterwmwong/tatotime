(function() {
  define(function() {
    return {
      getShows: function(done) {
        return done((function() {
          return {
            yesterday: [
              {
                name: 'Nikita',
                time: '2011-04-04 20:30:00',
                network: 'CW'
              }, {
                name: 'Hellcats',
                time: '2011-04-04 21:30:00',
                network: 'CW'
              }
            ],
            today: [
              {
                name: 'The Event',
                time: '2011-04-05 21:00:00',
                network: 'NBC'
              }, {
                name: 'The Vampire Diaries slkdjflksdjf sldkfjls dflkjfdlkj sldkfj slkfjl sldkfj',
                time: '2011-04-05 22:00:00',
                network: 'CW'
              }
            ],
            tomorrow: [
              {
                name: 'Entourage',
                time: '2011-04-06 22:00:00',
                network: 'HBO'
              }, {
                name: 'True Blood',
                time: '2011-04-06 23:30:00',
                network: 'HBO'
              }
            ]
          };
        })());
      }
    };
  });
}).call(this);
