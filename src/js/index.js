import TranslateService from "./services/translate";

// UI Elements
let languageOptions = $("#languageSelect");
let refreshButton = $("#refreshButton");
let submitButton = $("#submitButton");
let inputText = $("#englishInput");
let outputText = $("#output");

// Input Value Streams
let targetLanguageStream = Rx.Observable.fromEvent(languageOptions, "change").pluck("target", "value");
let inputTextStream = Rx.Observable.fromEvent(inputText, "keydown").pluck("target", "value").distinctUntilChanged();

// Trigger Streams
let submitButtonClickStream = Rx.Observable.fromEvent(submitButton, "click");
let enterKeyStream = Rx.Observable.fromEvent(inputText, "keydown").filter(e => e.keyCode === 13);
let refreshButtonClickStream = Rx.Observable.fromEvent(refreshButton, "click");

// Data Streams
let availableLanguagesStream = refreshButtonClickStream.startWith(void 0)
  .flatMap(() => TranslateService.getLanguages().delay(1000));

let translationStream = Rx.Observable.merge(submitButtonClickStream, enterKeyStream)
  .withLatestFrom(targetLanguageStream, _.nthArg(1))
  .withLatestFrom(inputTextStream)
  .flatMap(([language, input]) => TranslateService.translateText('en', language, input).delay(1000));

// Subscribers
let languagesLoadingSubscriber = refreshButtonClickStream.startWith(void 0).subscribe(() => {
  languageOptions.html(`<option value="">Loading...</option>`);
  languageOptions.prop('disabled', true);
});

let languagesLoadedSubscriber = availableLanguagesStream.subscribe(languages => {
  let choices = languages.map(lang => $(`<option value="${lang.language}">${lang.name}</option>`));
  languageOptions.html(choices);
  languageOptions.prepend(`<option value=""></option>`);
  languageOptions.prop('disabled', false);
});

let translatingSubscriber = Rx.Observable.merge(submitButtonClickStream, enterKeyStream).subscribe(() => {
  outputText.html(`<strong>Translating...</strong>`);
});

let translatedSubscriber = translationStream.subscribe(translatedText => {
  outputText.html(translatedText);
  inputText.val("");
});
