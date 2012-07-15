# Countdown

Countdown is a JavaScript plugin to easily create countdowns and counters.

- jQuery support: 1.6+ (will see if i can downgrade it a bit.)
- Prototype support: Not yet

For documentation, usage, and examples, see:  
http://github.com/fetch/countdown

### Using CoffeeScript & Cake

First, make sure you have the proper CoffeeScript / Cake set-up in place. We have added a package.json that makes this easy:

```
npm install -d
```

This will install `coffee-script` and `uglifyjs`.

Once you're configured, building the JavasScript from the command line is easy:

    cake build                # build Countdown from source
    cake watch                # watch coffee/ for changes and build Countdown
    
If you're interested, you can find the recipes in Cakefile.


### Countdown Credits

- Built by [Fetch!](http://www.fetch.nl/). 
- Concept and development by [Koen Punt](http://koen.pt/)
