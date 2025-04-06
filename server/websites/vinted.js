const fs = require('fs');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} sale
 */
const parse = (data, id) => {
  return data.map(item => ({
    idLego: id,
    title: item.title,
    linkVinted: item.url,
    status: item.status,
    price: item.price.amount,
    serviceFee: item.service_fee.amount,
    totalPrice: item.total_item_price.amount,
    sellerName: item.user.login,
    sellerURL: item.user.profile_url,
    img: item.photo.url
  }));
};


/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async function (url, id) {
    const response = await fetch(url, {
      "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "fr",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Microsoft Edge\";v=\"134\"",
          "sec-ch-ua-arch": "\"x86\"",
          "sec-ch-ua-bitness": "\"64\"",
          "sec-ch-ua-full-version": "\"134.0.3124.93\"",
          "sec-ch-ua-full-version-list": "\"Chromium\";v=\"134.0.6998.178\", \"Not:A-Brand\";v=\"24.0.0.0\", \"Microsoft Edge\";v=\"134.0.3124.93\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": "\"\"",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-ch-ua-platform-version": "\"15.0.0\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-anon-id": "62ec930d-288f-4f33-82c0-efaa1bf0cd61",
          "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
          "x-money-object": "true",
          "cookie": "__cf_bm=QqIgF2KNZSrxfKoI0cbQVFfd5YrhlUTJB7osR4qRE8I-1743963160-1.0.1.1-iU1eaY2o1Hw3pLTXlj7ZNWj2qf3GxquEsUMTwEMlarXCThBeYkdH6w96f2blcLa4prDFHMq4WUg1PflNUWYwhE4Q9wNvDk4cdtKWjiur3KYTciH0hWloIIUTcGdadWWI; v_udt=cFg3UXNEZkNpUWIwakxUWFZNb2xxUnVvSEhUaC0tNUhrODJsUml1T2IyekpPNS0tdVkwbmUxcDVya3kxMjVVSlFHd1Rsdz09; anon_id=62ec930d-288f-4f33-82c0-efaa1bf0cd61; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTYzMTcxLCJzaWQiOiJkOTczOWM0MC0xNzQzOTYzMTcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5NzAzNzEsInB1cnBvc2UiOiJhY2Nlc3MifQ.AJVspReo7qW94IHWdPyFiRvW0RYMap6yGH5m40tlCBSu-puUthMNjSp93uZ4LuI8vrd0He64B5_Pew6Rgfs_mgq4VhlMcsszpMjYUO3Aishix5XkpSnpoGpZVPHyhh6hzHb4csKxxf05xJw7D-JDkuGpJTNyMsfLSxXcp3CSZLQoANTi28z2uw3rZw4ppwYw5UimLHRqlIoygP4fsbewupAfi4z41Q26HZaujObXvm5Z6BjLv5oOjSAog5C-7rKMJJdVkAFVhZ6YniWHyzk5FZepXPq8rftoAUm12PugO_YhRTbF8Q6L2jbNbSdWSB4iUrEvBh2E3kqx-GV2yp_adw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTYzMTcxLCJzaWQiOiJkOTczOWM0MC0xNzQzOTYzMTcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1Njc5NzEsInB1cnBvc2UiOiJyZWZyZXNoIn0.EeY4MDZKxN0AjYBl2vvOBwbjNgXo2O1A-JMShmsKgPywlG5AbIeCbhu9FOpXlD07rzcza9DOtxf_POgODgMiIBJZQcY2feW_7jHES2KVlDYEQCWjADJhKXKQAikM6FXUsVB7RJdXvuxaW1LKIROuXL0PXC6Yc3mj8rd32FKCkxlS4DRYL1YiNkgbCOc4ROd1aVPGEhXk3hmsifTrUOhoGRYhyBumYS9lxIRFCI0gvZe5DtbZaGXUTTb4ZKwoD4YIBDR27dcZcUCptVs_0il9tUPMXsvldn8gRx-rQJ2-F-6QEW0MODNzJf5LAox3ScDpRmnKHWQ-Rhvb7We_nqnHBQ; anon_id=62ec930d-288f-4f33-82c0-efaa1bf0cd61; cf_clearance=xECBSCuQc20P6djcB_HlWHXC5fISvoMC1jgh5NkKIws-1743963184-1.2.1.1-0nKtg.GRWTmVuHErtEfiZPoBRfZUU6J2nfqr1R836IZDNisBqifrZ8m0ZvbIMYzD2XQJPcl.mtF34Vp1ClBSQP8aHIjRCudKNpTjeSJcMxw6LMxaQpxKhgskerxFCo9fVt2tuMlhwsphRith.mRfk8QznkpJCiYVxrMe9jLrglMdrz_pMSL6n2lQihz8vOBxFP4R5MI0hQppxcU2rq5NDd9sDQTEJvDe2TvsXAYRUrf8pmAqrTbYvEcNTjmsbdm9922PFtpbkHeSOvFBHZlCY1sO5jZcRY.rJkIRqWlJy0UUkCNCbFCYtTj4t2xZ7LBpt4VHp0rX72QVYeVB5OgphqF_LbbgGqPDzzKZIgVr4wsLD2dpq4xvgteR4VMmXqUT; v_sid=3db133b0e6a9857dfe85321174ca2e8a; OptanonAlertBoxClosed=2025-04-06T18:16:16.955Z; eupubconsent-v2=CQPcI7AQPcI7AAcABBENBkFgAAAAAAAAAChQAAAAAAFhIIAACAAFwAUABUADgAHgAQQAyADUAHgATAAqgBvAD0AH4AQkAhgCJAEcAJYATQArQBhwDKAMsAbIA74B7AHxAPsA_QCAAEUgIuAjEBGgEcAKCAVAAq4BcwDFAGiANoAbgA4gCHQEiAJ2AUOAo8BSICmwFsALkAXeAvMBhoDJAGTgMuAZzA1gDWQGxgNvAbqA5MBy4DxwHtAQhAheEAOAAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugD5AH7gQEAgZBBEEEwIMAQrAhcOAXAAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A-IB9sD9gP3AgeBBECDAEGwIVjoJYAC4AKAAqABwAEAALoAZABqADwAJgAVYAuAC6AGIAN4AegA_QCGAIkARwAlgBNACjAFaAMMAZQA0QBsgDvAHtAPsA_YCKAIwARwAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABIABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B8QD9gIHgQYAg2BCshAcAAWABQAFwAVQAuABiADeAHoAd4BFACOAEpAKCAVcAuYBigDaAHUgU0BTYCxQFogLgAXIAycBnIDVQHjgQtJQIwAEAALAAoABwAHgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACOAFXAMUAdQBDoCLwEiAKPAU2AsUBbAC8wGTgMsAZyA1gBt4D2gIHkgBwAFwB3AEAAKgAj0BIoCVgE2gKTAYsA3IB-4EEQIMFIGwAC4AKAAqABwAEEAMgA0AB4AEwAKoAYgA_QCGAIkAUYArQBlADRAGyAO-AfYB-gEWAIwARwAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHJgPHAe0BCECFpQA-ABcAEgAjgBzgDuAIAASIAsQBrwDtgH_AR6AkUBMQCbQFIAKfAV2AvIBiwDJgGpgNeAfFA_YD9wIGAQPAgmBBgCDYEKy0AEBTYAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; viewport_size=496; datadome=dqAJGHa4XP2gd4tlcvF5aGKc~KQAwnPQPjv0NSnw97CZFDhxU1JT9c64Z7XJRi_iqE5_Sb1CFKo86n8OU0~bwVQcr0QjiZFAjVDCefIz9DgYv4Dsl51dKBQLjzeThpAN; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+20%3A17%3A21+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=62ec930d-288f-4f33-82c0-efaa1bf0cd61&interactionCount=4&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=eFZJdmJuVC95TDNsVUZYcnYwRVNIcHhZTFhuNTZKVEtVQkx2TnJtaFNJMko2QXpyWU5QUHlXUXRzemJKRk5HNE8vTThkL2s2U0lzYWErVk9Jd0F6SU5rTUhyRFlBQmFINlJiVHRPRXFIRndjb2hGL3IxUDRhblhZcmp0YWF4RDdmWTVFdEI0N0ZCZ29pLzg0cDZZZ1JpS2NCQWxPc0JFeGNGRncxeWZibTEwWjRRSEZVUzltaUFYWWdOZndPWTFocGFaZmIzQXhoUVR4YnZiNUluelU5SjFuZ1lnM2FRY2puRW1RRmYza0hYS0FXV0xta3RJWHJKdU54RXZsSGpXZi0tUVVZZktRMk9TVGh6c3QzejA3dmo2dz09--8bed949e45d23d8834b3dcca68077f37d7356c48; banners_ui_state=PENDING",

          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });



    if (response.ok) {
        const body = await response.json();

        //console.log(body);
        const sales = parse(body.items, id);
        
        //fs.writeFileSync(`lego_sales_from_vinted_${id}.json`, JSON.stringify(sales, null, 2), 'utf-8');
        //console.log(`✅ Sales saved in lego_sales_from_vinted_${id}.json`);

        return sales;
    }

    console.error(response);

    return null;
}