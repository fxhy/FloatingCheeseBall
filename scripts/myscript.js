// JavaScript source code


(function () {
    var flagsLoaded = 0;
    var globe = planetaryjs.planet();
    // Load our custom `autorotate` plugin; see below.
    // The `earth` plugin draws the oceans and the land; it's actually
    // a combination of several separate built-in plugins.
    globe.loadPlugin(autorotate(10));// Comment this line to stop autorotate
    // Note that we're loading a special TopoJSON file
    // (world-110m-withlakes.json) so we can render lakes.
    globe.loadPlugin(planetaryjs.plugins.earth({
        topojson: { file: 'scripts/world-110m-withlakes.json' },
        oceans: { fill: '#000080' },
        land: { fill: '#339966' },
        borders: { stroke: '#008000' }
    }));


    // Load our custom `lakes` plugin to draw lakes; see below.
    globe.loadPlugin(lakes({
        fill: '#000080'
    }));
    // The `pings` plugin draws animated pings on the globe.
    globe.loadPlugin(planetaryjs.plugins.pings());
    globe.loadPlugin(planetaryjs.plugins.objects());
    // The `zoom` and `drag` plugins enable
    // manipulating the globe with the mouse.
    globe.loadPlugin(planetaryjs.plugins.zoom({
        scaleExtent: [100, 300]
    }));
    globe.loadPlugin(planetaryjs.plugins.drag({
        // Dragging the globe should pause the
        // automatic rotation until we release the mouse.
        onDragStart: function () {
            //this.plugins.autorotate.pause();
        },
        onDragEnd: function () {
            //this.plugins.autorotate.resume();
        }
    }));
    // Set up the globe's initial scale, offset, and rotation.
    globe.projection.scale(175).translate([175, 175]).rotate([0, -10, 0]);

    // Every few hundred milliseconds, we'll draw another random ping.
    var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
    setInterval(function () {
        var lat = Math.random() * 170 - 85;
        var lng = Math.random() * 360 - 180;
        var color = colors[Math.floor(Math.random() * colors.length)];
        globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: Math.random() * 10 });


        if (flagsLoaded == 0) {
        // add canada flag
        globe.plugins.objects.add(106.3468, 56.1304, {
            imagesrc: "images/canada.jpg",
            imageheight: 25,
            imagewidth: 50
        });
        // add canada flag
        globe.plugins.objects.add(104.1954, 35.8617, {
            imagesrc: "images/china.jpg",
            imageheight: 33,
            imagewidth: 50
        });
        // add india flag
        globe.plugins.objects.add(78.9629, 20.5937, {
            imagesrc: "images/india.jpg",
            imageheight: 33,
            imagewidth: 50
        });
        // add south africa flag
        globe.plugins.objects.add(22.9375, 30.5595, {
            imagesrc: "images/africa.jpg",
            imageheight: 33,
            imagewidth: 50
            });

            flagsLoaded = 1;
        }

    }, 150);

    

    var canvas = document.getElementById('cheemaglobe');
    // Special code to handle high-density displays (e.g. retina, some phones)
    // In the future, Planetary.js will handle this by itself (or via a plugin).
    if (window.devicePixelRatio == 2) {
        canvas.width = 800;
        canvas.height = 800;
        context = canvas.getContext('2d');
        context.scale(2, 2);
    }

    // Size of globe and translate to center
    globe.projection.scale(300).translate([350, 350]);
    // Draw that globe!
    globe.draw(canvas);

    // This plugin will automatically rotate the globe around its vertical
    // axis a configured number of degrees every second.
    function autorotate(degPerSec) {
        // Planetary.js plugins are functions that take a `planet` instance
        // as an argument...
        return function (planet) {
            var lastTick = null;
            var paused = false;
            planet.plugins.autorotate = {
                pause: function () { paused = true; },
                resume: function () { paused = false; }
            };
            // ...and configure hooks into certain pieces of its lifecycle.
            planet.onDraw(function () {
                if (paused || !lastTick) {
                    lastTick = new Date();
                } else {
                    var now = new Date();
                    var delta = now - lastTick;
                    // This plugin uses the built-in projection (provided by D3)
                    // to rotate the globe each time we draw it.
                    var rotation = planet.projection.rotate();
                    rotation[0] += degPerSec * delta / 1000;
                    if (rotation[0] >= 180) rotation[0] -= 360;
                    planet.projection.rotate(rotation);
                    lastTick = now;
                }
            });
        };
    };

    // This plugin takes lake data from the special
    // TopoJSON we're loading and draws them on the map.
    function lakes(options) {
        options = options || {};
        var lakes = null;

        return function (planet) {
            planet.onInit(function () {
                // We can access the data loaded from the TopoJSON plugin
                // on its namespace on `planet.plugins`. We're loading a custom
                // TopoJSON file with an object called "ne_110m_lakes".
                var world = planet.plugins.topojson.world;
                lakes = topojson.feature(world, world.objects.ne_110m_lakes);
            });

            planet.onDraw(function () {
                planet.withSavedContext(function (context) {
                    context.beginPath();
                    planet.path.context(context)(lakes);
                    context.fillStyle = options.fill || 'black';
                    context.fill();
                });
            });
        };
    };


    // Rotate Globe On Mouse Move
    $(document).mousemove(function (event) {
       
        globe.projection.rotate([event.pageX, event.pageY, 0]);
        

    });
 


})();