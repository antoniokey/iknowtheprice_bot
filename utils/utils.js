const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  PLACES_SELECTOR,
  RU_FILE_NAME,
  EN_FILE_NAME
} = require('../constants/constants');

const getHeadersData = $ => {
  try {
    const headers = [];

    $(HEADERS_SELECTOR).each((i, elem) => {
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

    $(LIST_SELECTOR).each((i, elem) => {
      const options = [];

      $(elem).children('li').map((i, elem) => options.push({ text: $(elem).text() }));

      list.push(options);
    });

    return list;
  } catch(err) {
    console.log(err);
  }
};

const getPlaces = async pageUrl => {
  const page = await axios.get(pageUrl);
  const $ = cheerio.load(page.data);
  const places = [];

  $(PLACES_SELECTOR).each((index, item) => {
    const title = $(item).text();
    const url = `https:${$(item).attr('href')}`;

    places.push({ title, url });
  });

  return places;
};

const savePlaces = (places, fileName) => {
  fs.writeFile(path.join(__dirname, '..', 'places', fileName), JSON.stringify(places), err => {
    if (err) {
      throw new Error(err.message);
    }

    console.log('Places were saved');
  });
}

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

const preparePlacesFiles = async () => {
  const places_ru = fs.existsSync(path.join(__dirname, '..', 'places', RU_FILE_NAME));
  const places_en = fs.existsSync(path.join(__dirname, '..', 'places', EN_FILE_NAME));

  if (!places_ru) {
    savePlaces(await getPlaces(process.env.WEBPAGE_RU), RU_FILE_NAME);
  }
  if (!places_en) {
    savePlaces(await getPlaces(process.env.WEBPAGE_EN), EN_FILE_NAME);
  }
};

module.exports = { getPriceList, preparePlacesFiles };
