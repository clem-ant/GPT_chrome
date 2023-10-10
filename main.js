// Fonction pour injecter la réponse de ChatGPT dans la page web active
function injectGptResponse(response) {
  console.log("inject");
  var div = document.createElement('div');
  div.textContent = response;
  div.style.color = "black";
  div.style.position = "absolute";
  div.style.color = "gray"
  div.style.top = '40 px'
  div.style.left = "40 px"
  div.style.zIndex = '10';
  document.body.appendChild(div);
}

// Écoutez l'événement chrome.contextMenus.onClicked
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "search") {
    var query = info.selectionText;
    // Utilisez la fonction searchGptWithOpenAI pour envoyer la requête à ChatGPT
    searchGptWithOpenAI(query);
  }
});

// Récupérer l'onglet actif



// Fonction pour envoyer la requête à ChatGPT
// Fonction pour envoyer la requête à ChatGPT
async function searchGptWithOpenAI(query) {
  var apiKey = "MET TA KEY LA LE SANG "; // Remplacez par votre propre clé API OpenAI
  // Assurez-vous que vous avez défini votre clé API OpenAI
  // Définissez l'URL de l'API OpenAI
  var apiUrl = 'https://api.openai.com/v1/chat/completions';
  var prePrompt = "Ici ton prompt pour conditionner" + query;
  // Données de la requête au format JSON
  var requestData = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prePrompt }],
    temperature: 0.7
  };

  // Effectuez la requête en utilisant fetch
  // ...
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify(requestData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Réponse non valide de l\'API OpenAI');
      }
      return response.json();
    })
    .then(data => {
      // Affichez la réponse complète dans la console pour le débogage
      console.log('Réponse de l\'API OpenAI :', data);

      // Récupérez la réponse de ChatGPT
      var responseFromChatGpt = data.choices[0].message.content;
      console.log(responseFromChatGpt);
      // Injecter la réponse dans la page web active
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tabId = tabs[0].id;
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: injectGptResponse,
          args: [responseFromChatGpt]
        });
      });
    })
    .catch(error => {
      console.error('Erreur lors de la requête à l\'API OpenAI :', error);
    });

}


// Créer le menu contextuel
chrome.contextMenus.create({
  id: "search",
  title: "Search",
  contexts: ["selection"],
});
