const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const getHeadersData = $ => {
  try {
    const headers = [];

    $('div[id="container"] div[id="node"] h2').each((i, elem) => {
      headers.push({ text: $(elem).text() });
    });

    headers.pop();

    return headers;
  } catch(err) {
    console.log(err);
  }
};

const getListData = $ => {
  try {
    const list = [];

    $('div[id="container"] div[id="node"] > ul').each((i, elem) => {
      const options = [];

      $(elem).children('li').map((i, elem) => options.push({ text: $(elem).text() }));

      list.push(options);
    });

    return list;
  } catch(err) {
    console.log(err);
  }
};

const getPriceList = page => {
  try {
    const $ = cheerio.load(page);
    const headers = getHeadersData($);
    const list = getListData($);
    const priceList = [];

    headers.forEach((header, index) => {
      const markdown = `
        <b>${header.text}:</b> \n
        ${list[index].map(option => `${option.text} \n`).join('')}
      `;
      
      priceList.push(markdown);
    });

    return priceList.join('');
  } catch(err) {
    console.log(err);
  }
};

const retrieveRuPlaces = async () => {
  const places = [];
  const webpage = await axios.get('https://www.globalprice.info');
  const $ = cheerio.load(webpage.data);

  $('#container #center #node .main_menu_column > a').each((index, item) => {
    const title = $(item).text();
    const url = `https:${$(item).attr('href')}`;

    places.push({ title, url });
  });

  fs.writeFile(path.join(__dirname, '..', 'places', 'places_ru.json'), JSON.stringify(places), err => {
    if (err) {
      throw new Error(err.message);
    }
  });
};

const retrieveEnPlaces = async () => {
  const places = [];
  const webpage = await axios.get('https://www.globalprice.info/en');
  const $ = cheerio.load(webpage.data);

  $('#container #center #node .main_menu_column > a').each((index, item) => {
    const title = $(item).text();
    const url = `https:${$(item).attr('href')}`;

    places.push({ title, url });
  });

  fs.writeFile(path.join(__dirname, '..', 'places', 'places_en.json'), JSON.stringify(places), err => {
    if (err) {
      throw new Error(err.message);
    }

    console.log('File was saved');
  });
};

const preparePlacesFiles = async () => {
  const places_en = fs.existsSync(path.join(__dirname, '..', 'places', 'places_en.json'));
  const places_ru = fs.existsSync(path.join(__dirname, '..', 'places', 'places_ru.json'));

  if (!places_en) {
    retrieveEnPlaces();
  }
  if (!places_ru) {
    retrieveRuPlaces();
  }
};

const handleLanguageAction = ctx => {
  const language = ctx.match;
  const responseText = `You choose ${language.toUpperCase()} language! Now, enter the country name you want to go to in order to get price list!`;

  ctx.session.botLanguage = language;

  ctx.reply(responseText);
};

module.exports = { getPriceList, preparePlacesFiles, handleLanguageAction };
