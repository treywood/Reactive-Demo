import TranslateService from "./services/translate";

// UI Elements
let languageOptions = $("#languageSelect");
let refreshButton = $("#refreshButton");
let submitButton = $("#submitButton");
let inputText = $("#englishInput");
let outputText = $("#output");
let checkbox = $("#autoTranslateCheckbox");

// Input Values
let targetLanguage = Rx.Observable.fromEvent(languageOptions, "change").pluck("target", "value");
let inputString = Rx.Observable.fromEvent(inputText, "keyup").pluck("target", "value").distinctUntilChanged();
let autoTranslate = Rx.Observable.fromEvent(checkbox, "change").pluck("target", "checked");

// UI Events
let submitButtonClick = Rx.Observable.fromEvent(submitButton, "click");
let enterKeyPress = Rx.Observable.fromEvent(inputText, "keydown").filter(e => e.keyCode === 13);
let refreshButtonClick = Rx.Observable.fromEvent(refreshButton, "click");

// Data Streams
let availableLanguages =
  refreshButtonClick.startWith(void 0).flatMapLatest(() => TranslateService.getLanguages());

let translatedText =
  autoTranslate.startWith(false).flatMapLatest(checked => {
    if (!checked) {
      return Rx.Observable.merge(submitButtonClick, enterKeyPress);
    } else {
      return Rx.Observable.merge(inputString.debounce(250), targetLanguage);
    }
  })
  .withLatestFrom(inputString, targetLanguage)
  .flatMapLatest(([e, input, language]) => TranslateService.translateText('en', language, input));

availableLanguages.subscribe(languages => {
  let choices = languages.map(x => `<option value="${x.language}">${x.name}</option>`).join("");
  languageOptions.html(choices);
  languageOptions.prepend('<option value=""></option>');
});

translatedText.subscribe(text => {
  outputText.html(text);
});

autoTranslate.subscribe(checked => submitButton.prop('disabled', checked));
