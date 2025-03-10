const fs = require('fs');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} sale
 */
const parse = data => {
  return data.map(item => ({
    title: item.title,
    linkVinted: item.url,
    status: item.status,
    price: item.price.amount,
    serviceFee: item.service_fee.amount,
    totalPrice: item.total_item_price.amount,
    seller: item.user.profile_url,
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
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "fr,fr-FR;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,es;q=0.5",
          "cache-control": "max-age=0",
          "if-none-match": "W/\"84fe453edda681896266413f89ce4359\"",
          "priority": "u=0, i",
          "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Microsoft Edge\";v=\"133\", \"Chromium\";v=\"133\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "v_udt=bmQ0cnF4US9nQUd1bTIvWS9MTmtmVWhNbXhIVy0tSFBWSGFZakpRY1RDcFZmeS0tVUtSWHVzVnhoNS9kQnAxRThkZWhCUT09; anonymous-locale=fr; anon_id=282767a3-622b-41fa-9ea8-a0dc1e2ac40b; ab.optOut=This-cookie-will-expire-in-2026; domain_selected=true; OptanonAlertBoxClosed=2025-01-06T14:48:07.256Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; viewport_size=646; __cf_bm=7xHm0eeWbEPmNyK8.txv_zSt61NcXHqQ5n46GVRGfU8-1741619266-1.0.1.1-XsIeV.KuyQER4ffaDsinIULoH4Dam.hjNxlTu.732vab0WJWWuXD4UCXJ6qpHOMnkyjAtrLYDAY6xrJrhLEX1ya_KUG25GuYAZ8oItZCwOlMhQVcgNqQcj8pon5bvJNU; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjE5MjY3LCJzaWQiOiI1M2QxY2FlZC0xNzQxNjEyMjcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MjY0NjcsInB1cnBvc2UiOiJhY2Nlc3MifQ.HivRsBJVhtkFhKPyPPEFq0hoCFWFIl0ctw8_MoG3LxAUjDC4It1XHhn28S8gXpQsi_JXDyjoBecLGDbN3WsDTYnwEFmiyWM75vnLWb2uXXo4cFNRqt8kKzWKhtSuc5bh6OSwGdBW9FPKiZEvc9840C-Vhtq7CAQXIRSeN9-UEakefHiG2F5lyyZ1yxKqIMGRDmNXPRrSGgNkeWiMdR7wAeFEMyyNBqoCSNWf-FHc6SyjlVrsYt70xbqdup6zM4oyPLxXxJACW02sq3gaKa9xMDNjCC-NR4cXjNZhpxMJaeY7rCJSUXFwM36vse2g-09GuWjO4a3lwSa3KqUlSniAuA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjE5MjY3LCJzaWQiOiI1M2QxY2FlZC0xNzQxNjEyMjcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMjQwNjcsInB1cnBvc2UiOiJyZWZyZXNoIn0.dRVsfCktf2sSY-VJln3HD-t9seZCRfeEwXESofHSl4b2kNsd88jYyIBjvCwLf6fcgFjbq9lKOw25rI07Mwsl2q_hK86wZlBHxLnRlcUoa_nxjAiStCgShnntAyGtdqUqOlO66Z78nxKJOeDDGFxtytHAbIm_vydh9ni7oNzIQcAzDftzXpYu829_CmUX0xW_MicucGDuineX8VTlCE3vl6sJmA_u7T125pf4smSvn82mQyf82ede23O_qu4e_8w7w7wlTsEY0ZF0VE84dXaeEa95waCwU01HEDwtJk4lI2NhMUyxYxgwEQRgKAeloG-52w5w4hHea5BFIZABNyJWSg; v_sid=53d1caed-1741612271; cf_clearance=Ndy.770Z_AYE4JH06KOEBOiAGCl2ydKtDUw6_ZKV3CY-1741619269-1.2.1.1-ruW427tv2yOP8uO50iejs7LBJNOvzLXDoa9vL0_yiL3j779qDNKZ0wl.8AByJHFCwxP1DgQ7Ghk4yNaM3kycmaKSrnTZoR_k9LOQ3QIRTy.q91nV93SNqiowngOQvBcp9prTNesRY10SZHVuTsc6JTM4jPw9zoT4lUWnaJhEXO9agCCmB.4L4JqLZDf2eunFqr7GhroguL0l_e9HO6OlvSdQZojngeViYHsuB4W7604_Kx24FO4rTTSPXgFJVHZWlAGvdZTGnI5LMcEHXZ6MWmfo.tBIAP5VLOyMr2cWKECX_9PaiBdaZMuho_oPSzZoc4RgvjP8Y53Eqe1bKc2VOpnBNSdiJDraYV4XNGMDBTfW._DYjiyt6x.Z9NOeYgMa6maIOjx40sME7ie2QPL_Uyz_hOL1i2Bn_7t6FdbOeyM; v_sid=53d1caed-1741612271; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+10+2025+16%3A07%3A50+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=282767a3-622b-41fa-9ea8-a0dc1e2ac40b&interactionCount=26&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; banners_ui_state=SUCCESS; datadome=9fxYomu~jni9HlMAZHT80nt9yr9ZW70M8hlpbrYyGP5laoiyCckDQ8rrT1NgLThVRj9o_dpgo3b7CccGDk00Y8Hl2namCe3wI5_OkN9ZkdZgNOfJy~RWIHYWLPu5Jgvk; _vinted_fr_session=ajRoT3ZIaXpTY0F5VGlWbW9OdXlzbFRxYXZFckx4WnBFbDlPYjlaVWpocFlEWm9HSi9CM0M0a0hVcWR4eU44bUpKMVg2TUE4SVNFMC9HdkF2YXM0RTViWVZQbTV3VWJJSTZPSFgvQStpdnJYazZSMkJJWXJiVlp5WXlQUXpUNHdlUkZPY0FMMHFBWXIyVXl0eFhQNGRRUUp0Q0xIZ3h6bnZqNy80QWxqWm1kUE9ETjU5NkFmVTdxR0tVZEplS3RwMldVYVprUkhBWEdQNGFBQzJBUVV4bnNucWl6aWI5L29ZNHI3QTExYTF4Y0t3bVN2eGtaK1FDZFFyTDVJTHFFeWhjYUpuVlptNUVrNzgwNXZoREIzclJJNUI3SDNjeWNnQ3dxWTFCM1FpZTdEblNIODBiRzhMVkNOOU1sZGZEbVUvb0JKWTBadVhKWnpmZE1aUjd4MkFBR0k3LzY3QkVlR1pqWHk1dkNLdkdoSGxhK0pJMW9hdUU0aWlqMWhSUm9rWXlxcm5yVDVTcHB6Y3NUMmlSNE5oY1RoT0c4ZWNwNGt5Y204a2NkMW5zMjNWcml0ZGpweEtoRU1sWGNEZ3lZdi9TanlEc0dCRVY0MXJUdjBTVVZZb0Q1eXI1YUVocHR1djhycGFOd3FjNW5udUpMd2VoOWhwT2FHa0lHWWZnUUVxQlNZeWhPQ3NiUUhDTHMrSy9CSVFTRWhQQThtd2t1NzRNdDdUUFhsb0MzNVVyaXdmMVgrbGxzaUoyZEExR1BRa0RwRkxHNUJNZlQ1OVp1bmtsYllUOEJRbWFzUTh4TGdvaFQ3QUtNbEZ2WGl1T0ZyQXg5SlNxVkdvdmtaaFRkckdvZS9IbkNhbTlDR3ZEd3VBd0tlYnM3YTJteU1nN0FlZXIyaUd5NzJjUFpNeHZBUm1MZ3dMc0hNeCtacUJTSGFtUmRpV1huSmkvZHZFdEZIVFFCbktpU3E3Z0NBZDZMSS9lck5JQUNkTithaFJjWEpTdlh2WU9EMGhBMzQySW90WVdmc0ZNYnBETHgvNVZWMVJzTENuNXFFNzJlblh0SXVUSHZLZ1dHWnI3WUdIVm40azlCZkRnNUJtc0tTY05lQ1B1WTJBNVpEVlJSVU1Jd3JLYzF6ZW4vYlpUUjIyajA0MG9aSndRN1cwU3p0MEZ6cU5rc01xT3Zkb2R6eFlidzI3YXhDTEJER2Z0MHlhZTFCKzNYN1NCbS9lU1lvVUVNMlJ5UVZoUFJPSlhUNWNhZjhoV0JvYUd1aHF4MzNwVGtjSllNVjhCNjVBVWpkeFZrR3Y4OVNScHlxNC83SmRIK1BtSUx3a3VHNnh4U3dLWUNORnFvaUt2Nk90SFBTcmh5dWhWWkV0VytwSWcwclM4VGN3R2lhNXdRbEUyVVZDZkd1MUYzVlkvUkRsTnhXWlBkMS9XU0lkc1VHOERWaVFmdW5qVktIbkdzVE5YaWtvdWhlb2VKUGlCR25vcUdTb0laZUZWNWhhZ1d4YmRlV3RicWxjakNwR01aSkVkY0FnQlpqNzNzTzdhNzF3Zm5TUXFmV0tXRlFLSFNsaGFYeHZiTmhkRHlvNmFZNkVYQ1VKS1YxYTk3QjVhdWNGOHhaZS9rVUtmVTNnNnlqd1Z2WGdBTGlpbExUSWxhMU1rOXR5OGtWMHE1TzNIa1Y0VlNTL0krTnJ3VWdDWEdoTWhQZ1lNU3UwSmRZSXlsNEpnTTM3ZmJIT2FtUmpNN3QwZUVFTjNxN25TTzkwZDV4eUtsaFphc0lqQm5LS1FRZlNheng5YVJqNk5GQ2lxYUdWT3NKZE4zb0F5dXRmclpSemtOazI2WjN0bXRkNThIQ1ZTYWJXeWdReGhYZUV5ZGZQWXg3MjBTUFRteld5SkczUmRxSlRyT2JOWHB6aDRwTDdGM1hSMHoyWnQ0VWVrMzZCYUJFdU9qVElMYUFPaUdGN2RaTGFNK1A3SXduVUR0ZVZQTndQRSs4MkJDVkV1WEVLajFYZTcwbUVHSFA0R1RHcklWZ2NQYm11ZUF1eTljbVdnRUdKWW5BR21XQkxLQVV0T1p4Tko2NUdMaUpoSWp3cnZMMlJkZWVxbU9odnRJUHBiZ0dTT3NocjZPWVZJWWRQUDMxZHJadmZwNWVPZWUzNHNFY0FvRHVnMmpoTkkxYmFaNEFGeitYMkxRdnA3eFNleEUxdTdBN2plZUEzUjZac0N6YysvQXNEcVU5bWloNkp0b0I1d1pjVVNZU2dEbVNqbS95MEw0WUk0a25tUWxvWFdqNkF6ZmVSUmtzZXFJUzUxcHFUcFhibTFwSWk5S1FWOVN1c2dwVHNSanpJdkpqRndhbU9INmo5dW0xdnZJY3Y3MTdZSEt4UUQzN0hydk9iWUIySTNVMS0tWlRIU3U0c2FaOUdxTGVnZllaMU9wZz09--5459a290bc5ec45edc4b852765143105773bd4f3"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
      });

      console.log(id);

    if (response.ok) {
        const body = await response.json();

        const sales = parse(body.items);
        
        fs.writeFileSync(`lego_sales_from_vinted_${id}.json`, JSON.stringify(sales, null, 2), 'utf-8');
        console.log(`✅ Sales enregistrées dans lego_sales_from_vinted_${id}.json`);

        return sales;
    }

    console.error(response);

    return null;
}