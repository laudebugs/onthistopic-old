const passport = require('passport');



    //homepage
    app.get('/', function(req, res){

        res.render('home.hbs');
    })

    //Sign up page
    app.get('/signup', function(req, res){
        
        res.render('signup.hbs');
    })

    //Sign in page
    app.get('/signup', function(req, res){
        
        res.render('signin.hbs');
    })
    app.post('/signup', function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.render('signup', { user : user });
            }

            passport.authenticate('local')(req, res, function () {
            res.redirect('/');
            });
        });
    });

    app.get('/signin', function(req, res) {
        res.render('signin.hbs', { user : req.user });
    });

    app.post('/signin', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //topics page
    app.get('/themes', function(req, res){
        
        res.render('topics.hbs');
    })

    app.get('/themes/hope', function(req, res){
        //console.log(podcast_list);
        //var pod_iframes = `<iframe src=${podcast_list[0]}width="100%" height="60" frameborder="0" ></iframe>`;  
        //document.body.innerHTML = pod_iframes;
        let x = '<iframe src=$"https://open.spotify.com/embed-podcast/episode/4JdeRgDdgFvIBaFNiRyiLq"width="100%" height="155" frameborder="0" ></iframe>';
        
        res.render('topic.hbs', {pod:x});
    });
    app.post('/topics/hope', function(req, res){
        //podcast_list.push(req.body.podcast_url)
        let link = /"https:\S+"/;
        let matches = [...req.body.podcast_url.matchAll(link)];
        //console.log("len of matches: ", matches.length);
        let source_url = matches[0][0];
        podcast_list.push(source_url);
        res.redirect('/topics/hope');
    })
    //people page
    app.get('/people', function(req, res){
        
        res.render('people.hbs');
    })

    //map page
    app.get('/map', function(req, res){
        
        res.render('map.hbs');
    })

    //my account page
    app.get('/foryou', function(req, res){
        
        res.render('4u.hbs');
    })

    //my account page
    app.get('/myaccount', function(req, res){
        
        res.render('myaccount.hbs');
    })



