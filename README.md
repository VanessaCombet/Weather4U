# Weather4U: Final Project


‼️ 
**IF YOU CLONE/DOWNLOAD this project**, make sure you insert your openCage and openWeather API keys in `config_sample.js` which you'll rename as `config.js`.
!!

## PROJECT'S DESCRIPTION

The aims of this project are twofold:
- a homepage displaying the weather forecast for a given city (based on API's) ;
- a website to share pictures: users can add their own images to the website, view them and even comment them.
The website's design is responsive.

## Weather forecast

Weather4U is a proper interactive website, using JavaScript to fetch data from APIs and displaying dynamic information in the HTML page (without reloading it): the weather forecast for a specific city.

The homepage integrates a form letting the visitor search for a specific city. Then, using JavaScript, we fetch the forecast for that city and modify the HTML page to display it.

Two APIs are used to fetch the weather forecast:
- the [OpenCage Geocoder API](https://opencagedata.com/) to get the GPS coordinates from the city name;
- the [OpenWeather API](https://openweathermap.org/) gives us the weather forecast for the next 7 days for given GPS coordinates (One Call API).

When it comes to displaying the information on the HTML page, we grouped it into the 5 following categories:
- Clear,
- Snow,
- Clouds (if there are more than 50% of clouds),
- Cloudy (between 0 and 50% of clouds),
- Rain (in all other cases, so including Thunderstorm, Mist, etc).

The visitor can choose how many days will be forecasted between 1 and 7.

There's a day/night styling of the page (if it's night time for the requested city, it switches to night mode).

Finally, it uses Promises to handle the asynchronous requests.

## PicShare
Our application is also a website to share images. Users can add their own images to the website, view and comment them. You will find:

- a **showgallery page**, where all images are displayed. Images are ordered by their creation date in descending order (the most recent image is displayed first). The page can be filtered by a given category through query parameters;
- a **showpicture page** to display a given image and its title / description (when we click on an image from the showgallery page);
- an **upload page** to upload a new picture, with a title, a category (to be chosen among a list of available categories) and a description. Uploaded images will be saved in your filesystem.

It includes the following functionalities:
- proper validations: the uploaded file is an image (jpeg, png, gif...) ;
- a **comment system** to view/add comments on the page that shows a given picture.

It's built using Flask/SqLite/JS/HTML/CSS.

### Code organization

Repo structure (without env/ nor requirements.txt) as of 24 Apr. 2022:

```
├── app.py
├── database/
│   ├── app.db
│   ├── init_db.py
├── package-lock.json
├── package.json
├── static/
│   ├── css/
│   │   ├── general.css
│   │   ├── queries.css
│   │   ├── showgallery.css
│   │   ├── showpicture.css
│   │   ├── styles.css
│   │   ├── uploads.css
│   ├── img/
│   │   ├── gallery/
│   │   ├── icons/
│   │   ├── logo.png
│   │   ├── photos/
│   │   ├── users/
│   ├── js/
│   │   ├── config_sample.js
│   │   ├── data.js
│   │   ├── main.js
│   │   ├── uploadform.js
│   │   ├── utils.js
│   ├── manifest.webmanifest
│   ├── robots.txt
├── templates/
│   ├── index.html
│   ├── layout.html
│   ├── showgallery.html
│   ├── showgallerycat.html
│   ├── showpicture.html
│   ├── uploads.html
├── uploads/

```

To launch website:
******************
```
# to create database (will create the app.db) #
***********************************************
database$ python3 init_db.py

# to install virtual env and activate it #
******************************************
python3 -m venv env
source env/bin/activate

# to upgrade and install flask #
********************************
pip install --upgrade pip
pip install flask

# just to check #
*****************
pip list

# create requirements #
***********************
pip freeze > requirements.txt

# set env and launch server #
*****************************
export FLASK_APP=app.py
export FLASK_ENV=development
flask run

# to end process: #
*******************
Ctrl+C
deactivate
````
## ENJOY!