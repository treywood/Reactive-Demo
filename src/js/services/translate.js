import Http from './http';

const API_KEY = "AIzaSyDA_YOxrZbHJoV-iGmaND6nCJQrSIUQ5j0";

export default class TranslateService {

  static translateText(from, to, text) {
    text = encodeURIComponent(text);
    return Http.get(`https://www.googleapis.com/language/translate/v2?key=${API_KEY}&source=${from}&target=${to}&q=${text}`)
      .then(response => _.get(response, "data.translations[0].translatedText", null));
  }

  static getLanguages() {
    return Http.get(`https://www.googleapis.com/language/translate/v2/languages?key=${API_KEY}&target=en`)
      .then(response => {
        let languages = _.get(response, "data.languages", []);
        return _.sampleSize(languages, 10);
      });
  }

};
