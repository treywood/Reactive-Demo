import TranslateService from "./services/translate";

// UI Elements
let languageOptions = $("#languageSelect");
let refreshButton = $("#refreshButton");
let submitButton = $("#submitButton");
let inputText = $("#englishInput");
let outputText = $("#output");

function loadLanguages() {
  TranslateService.getLanguages().then(languages => {
    let choices = languages.map(x => $(`<option value="${x.language}">${x.name}</option>`));
    languageOptions.html(choices);
    languageOptions.prepend('<option value=""></option>');
  });
}

function doTranslate() {
  let language = languageOptions.val();
  let input = inputText.val();
  TranslateService.translateText('en', language, input).then(translatedText => {
    outputText.text(translatedText);
    inputText.val("");
  });
}

refreshButton.on("click", loadLanguages);
loadLanguages();

submitButton.on("click", doTranslate);
inputText.on("keydown", e => {
  if (e.keyCode === 13) {
    doTranslate();
  }
});
