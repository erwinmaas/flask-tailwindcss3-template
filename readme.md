# Flask with TailwindCSS

Starting a Flask project with Tailwindcss postcss processor

## Installation
First of all contain the Python environment
```
python3 -m venv venv
. /venv/bin/activate
```

Install the python dependencies
```
pip install -r requirements.txt
```

Initialize npm and install TailwindCSS
```
npm init
npm install tailwindcss
npx tailwind init
touch postcss.config.js

npm install --global postcss postcss-cli
npm install -D watch
```

Prepare the main.css and the html templates
```
mkdir -p static/src
touch static/source/main.css

mkdir templates
touch templates/base.html && touch templates/index.html
```

## Run

After preparing it all, run a npm watch script for rebuilding the css (since Tailwind uses JIT as default) and start the Flask server
```
npm run watch //to check if .html in ./templates/ change
python app.py
```


## Files

Use the watch script to rebuild the dist main.css
```
# package.json
{
  "name": "ispellbook",
  "author": "Erwin Maas",
  "watch": {
    "build": "templates/*.html"
  },
  "scripts": {
    "watch": "NODE_ENV=development watch 'npm run build:css' ./templates",
    "build:css": "postcss static/src/main.css -o static/dist/main.css"
  },
  "dependencies": {
    "tailwindcss": "^3.0.8"
  },
  "devDependencies": {
    "watch": "^1.0.2"
  }
}
```

```
# postcss.config.js

const path = require('path');

module.exports = (ctx) => ({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
});
```

Tailwind >v3 uses JIT to keep the final css small. You have to white-list the content iot generate the css file
```
# tailwind.config.js

module.exports = {
  content: [
    './templates/**/*.html',
    './static/src/*.css'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Use Environment and Bundle to control the location of the static assets
```
# app.py

from flask import Flask, render_template
from flask_assets import Bundle, Environment

app = Flask(__name__)

assets = Environment(app)
css = Bundle("src/main.css", output="dist/main.css", filters="postcss")

assets.register("css", css)

@app.route("/")
def homepage():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
```

```
# templates/base.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    {% assets 'css' %}
      <link rel="stylesheet" href="{{ ASSET_URL }}">
    {% endassets %}

    <title>iSpellbook</title>
</head>
<body class="bg-blue-100">
    {% block content %}
    {% endblock content %}
</body>
</html>
```

```
# templates/index.html

{% extends "base.html" %}

{% block content %}
<h1>Hello iSpellbook</h1>
{% endblock content %}
```