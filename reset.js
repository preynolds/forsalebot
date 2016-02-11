/*

Clear DB
Create sample data

*/

// fsb classes
var Fsbdb = require('./fsbdb');
var db = new Fsbdb();


db.deleteAll(function(resp) {
  console.log(resp);

  // create some data

  db.createProvider(
    'helifreak',
    'Helifreak',
    'http://helifreak.com/',
    '',
    'tbody td div a[id^="thread_title"]', 
    function(provider){
      hfForums = [ 
        { url: 'forumdisplay.php?f=356',
          title: 'For Free - HF Members Helping HF Members' },
        { url: 'forumdisplay.php?f=432',
          title: 'Free parts requests from other HF Members' },
        { url: 'forumdisplay.php?f=256',
          title: 'Want To Trade - All WTT Threads go here' },
        { url: 'forumdisplay.php?f=38',
          title: 'Want To Buy - All WTB Threads go here' },
        { url: 'forumdisplay.php?f=351',
          title: 'Helicopters - For Sale in Europe' },
        { url: 'forumdisplay.php?f=88',
          title: 'Electric Helicopters - Only E-Helis' },
        { url: 'forumdisplay.php?f=89',
          title: 'Electric Motors, ESC\'s, BEC\'s, Chargers and Batteries' },
        { url: 'forumdisplay.php?f=15',
          title: 'Gas, Glow and Turbine Helicopters' },
        { url: 'forumdisplay.php?f=50',
          title: 'Engines/Mufflers for Sale - Liquid Fuel Helis' },
        { url: 'forumdisplay.php?f=51',
          title: 'Electronics - Radios, Servos, Gyros, etc' },
        { url: 'forumdisplay.php?f=433',
          title: 'FPV Equipment for sale and wanted' },
        { url: 'forumdisplay.php?f=132',
          title: 'Everything Else Helicopter Related - Heli Parts, Blades, Simulators and more' },
        { url: 'forumdisplay.php?f=352',
          title: 'Single Rotor Blades for Sale' },
        { url: 'forumdisplay.php?f=198',
          title: 'Scale Helicopters, For Sale' },
        { url: 'forumdisplay.php?f=338',
          title: 'Airplanes and supplies For Sale' },
        { url: 'forumdisplay.php?f=16',
          title: 'Everything Else for Sale - Non Heli Related' },
        { url: 'forumdisplay.php?f=39',
          title: 'Stolen, Ripoffs and Scammer alerts' } ];
      for (var i = 0; i < hfForums.length; i++) {
        hfForums[i].provider = provider._id;
        hfForums[i].tasks = [];
      };
      db.createForums(hfForums, function(docs){
        console.log(docs);
      })
  });

  db.createProvider(
    'rcgroups',
    'RC Groups',
    'http://www.rcgroups.com/',
    'forums/',
    'a[class=fsw-title]', 
    function(provider){
      rcgForums = [ { url: '/trader-talk-269', title: 'Trader Talk' },
        { url: '/hot-online-deals-429', 
          title: 'Hot Online Deals' },
        { url: '/aircraft-general-miscellaneous-fs-w-306',
          title: 'Aircraft - General - Miscellaneous (FS/W)' },
        { url: '/aircraft-general-radio-equipment-fs-w-215',
          title: 'Aircraft - General - Radio Equipment (FS/W)' },
        { url: '/aircraft-electric-airplanes-fs-w-15',
          title: 'Aircraft - Electric - Airplanes (FS/W)' },
        { url: '/aircraft-electric-batteries-and-chargers-fs-w-284',
          title: 'Aircraft - Electric - Batteries & Chargers (FS/W)' },
        { url: '/aircraft-electric-helis-fs-w-44',
          title: 'Aircraft - Electric - Helis (FS/W)' },
        { url: '/aircraft-electric-micro-and-indoor-airplanes-fs-w-489',
          title: 'Aircraft - Electric - Micro & Indoor Airplanes (FS/W)' },
        { url: '/aircraft-electric-jets-fs-w-380',
          title: 'Aircraft - Electric - Jets (FS/W)' },
        { url: '/aircraft-electric-multirotor-fs-w-733',
          title: 'Aircraft - Electric - Multirotor (FS/W)' },
        { url: '/aircraft-electric-power-systems-fs-w-285',
          title: 'Aircraft - Electric - Power Systems (FS/W)' },
        { url: '/aircraft-fuel-airplanes-fs-w-38',
          title: 'Aircraft - Fuel - Airplanes (FS/W)' },
        { url: '/aircraft-fuel-engines-and-accessories-fs-w-362',
          title: 'Aircraft - Fuel - Engines and Accessories (FS/W)' },
        { url: '/aircraft-fuel-helis-fs-w-213',
          title: 'Aircraft - Fuel - Helis (FS/W)' },
        { url: '/aircraft-fuel-jets-fs-w-381',
          title: 'Aircraft - Fuel - Jets (FS/W)' },
        { url: '/aircraft-sailplanes-fs-w-100',
          title: 'Aircraft - Sailplanes (FS/W)' },
        { url: '/boats-fs-w-104', 
          title: 'Boats (FS/W)' },
        { url: '/cars-accessories-fs-w-562',
          title: 'Cars - Accessories (FS/W)' },
        { url: '/cars-cars-and-parts-fs-w-53',
          title: 'Cars - Cars and Parts (FS/W)' },
        { url: '/cars-motorcycles-fs-w-563',
          title: 'Cars - Motorcycles (FS/W)' },
        { url: '/cars-trucks-and-parts-fs-w-564',
          title: 'Cars - Trucks and Parts (FS/W)' },
        { url: '/fpv-equipment-fs-w-710',
          title: 'FPV Equipment (FS/W)' },
        { url: '/non-rc-items-fs-w-268', title: 'Non R/C Items (FS/W)' } ]
      for (var i = 0; i < rcgForums.length; i++) {
        rcgForums[i].provider = provider._id;
        rcgForums[i].tasks = [];
      };
      db.createForums(rcgForums, function(docs){
        console.log(docs);
      });
  });

  db.getUser('a@a.com', function(resp) {
    db.getForum('FPV Equipment [(]FS/W[)]', function(doc){
      db.createTask(
        {
          "name": "circular wireless",
          "forum": doc._id,
          "needle": ["circular","wireless"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
    db.getForum('FPV Equipment [(]FS/W[)]', function(doc){
      db.createTask(
        {
          "name": "fatshark",
          "forum": doc._id,
          "needle": ["fatshark"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
    db.getForum('Electronics - Radios, Servos, Gyros, etc', function(doc){
      db.createTask(
        {
          "name": "spartan",
          "forum": doc._id,
          "needle": ["spartan"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
  });// create user


  db.getUser('b@b.com', function(resp) {
    db.getForum('Aircraft - Electric - Multirotor', function(doc){
      db.createTask(
        {
          "name": "qav250",
          "forum": doc._id,
          "needle": ["qav","250"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
    db.getForum('Electric Helicopters - Only E-Helis', function(doc){
      db.createTask(
        {
          "name": "goblin 700",
          "forum": doc._id,
          "needle": ["700","goblin"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
    db.getForum('Electronics - Radios, Servos, Gyros, etc', function(doc){
      db.createTask(
        {
          "name": "spartan",
          "forum": doc._id,
          "needle": ["spartan"],
          "user": resp._id
        },
        function(task) {
          console.log(task);
        }
      );
    });
  }); // create user
}); // db.deleteAll



setTimeout(function() {
  //db.close();
}, 500);

