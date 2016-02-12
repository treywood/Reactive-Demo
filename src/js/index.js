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
let buttonClickStream = Rx.Observable.fromEvent(submitButton, "click");
let enterKeyStream = Rx.Observable.fromEvent(inputText, "keydown").filter(e => e.keyCode === 13);

// Data Streams
let availableLanguagesStream =
  Rx.Observable.fromEvent(refreshButton, "click").startWith("")
  .flatMap(() => TranslateService.getLanguages());

let translationStream =
  Rx.Observable.merge(buttonClickStream, enterKeyStream)
  .withLatestFrom(targetLanguageStream, _.nthArg(1))
  .withLatestFrom(inputTextStream)
  .flatMap(([language, input]) => TranslateService.translateText('en', language, input));

// Subscribers
let languagesSubscriber = availableLanguagesStream.subscribe(languages => {
  let choices = languages.map(lang => $(`<option value="${lang.language}">${lang.name}</option>`));
  languageOptions.html(choices);
  languageOptions.prepend(`<option value=""></option>`);
});

let translationSubscriber = translationStream.subscribe(translatedText => {
  outputText.html(translatedText);
  inputText.val("");
});
