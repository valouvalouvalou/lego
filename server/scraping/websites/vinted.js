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
          "x-anon-id": "282767a3-622b-41fa-9ea8-a0dc1e2ac40b",
          "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
          "x-money-object": "true",
          "cookie": "v_udt=bmQ0cnF4US9nQUd1bTIvWS9MTmtmVWhNbXhIVy0tSFBWSGFZakpRY1RDcFZmeS0tVUtSWHVzVnhoNS9kQnAxRThkZWhCUT09; anonymous-locale=fr; anon_id=282767a3-622b-41fa-9ea8-a0dc1e2ac40b; ab.optOut=This-cookie-will-expire-in-2026; domain_selected=true; OptanonAlertBoxClosed=2025-01-06T14:48:07.256Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=12d1cb8f-1743105159; __cf_bm=6u.BB8BkbpuEiU063Galj2OYKV__htATS57ZKcF5ViU-1744042766-1.0.1.1-z_e2RqWELro7gzR2eXTKVdXZz6cQ.QlLV98sTXG783yYZ4wY4XwqCoxxhFhiMo7QskN61NJNHR42tMRUPOehu9QXr9acVzMwIOUr3tk.WIn0BBtNo2tFQxRO86JU9dzN; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQ0MDQyNzc1LCJzaWQiOiIxMmQxY2I4Zi0xNzQzMTA1MTU5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQwNDk5NzUsInB1cnBvc2UiOiJhY2Nlc3MifQ.dq4VrRywkuDXRGgTrR_wlym0E0iD-DEQWkw3s0TMzAjKLR687lzHK_B_ncKgjfyt_hBEJOVkO2Y9j5i6hTnkesY0zGrxJdqcDrvjWkUEgasUyxLpg0JLkDHRyLyTD5PffqoIn-077FH-jK7uirv0_lYfkFj9jgjNjNS6FgIXiPEOngbkvCE3jMU-ZPJDeVrf_ea2wv-By6SYHYvgg1oDM_3jHTxHu8KLGJ04kyPIpltcFrZ6u0t4Vnk1GFgwyrIirpEjpeuZkxZODtFSsDtOFWY-ahuTbdBlli2loDSJrRVCS2H2xrweOMK40ohgl5K3ocwelIl3RJDi8cl_rKVvyw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQ0MDQyNzc1LCJzaWQiOiIxMmQxY2I4Zi0xNzQzMTA1MTU5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ2NDc1NzUsInB1cnBvc2UiOiJyZWZyZXNoIn0.Ks323LlNVOi4iMM4W4HB66A8vj-v76S3OMixdKYwA3un_cVeI0gWyp5NA8AxRfWZtosUf3eunPm4ipZTeNqdga3fHFkL7EP3ZhWCUfW_z7ATlKe4DRU3ymytw-OJ4nFXrdcZ4eOTbBjlWnFWavJVTcEG04OaNqi1DUdwMADvPjeL5CxlRda52GKAhPw8caPG9whybVUe4J7drhbWa8tCXLhqHU4BRbwOcd4hHI11nFDnrTHBwIk47xUYgfTdczCyIja-Uuv3hYUhH-I6XsaKldTvZvyX_ye6GlxFRVZL-9FNsiY6wcdneIt4LXSj15vE9oOMj-abb9HRDCqpTW7dbQ; cf_clearance=D5lLuU0nIPoos5gPbF8K2cphezplUVFw6YKyVBovidw-1744042778-1.2.1.1-zL2WpkHW.rtfOZJfR1kiN.o8y0x5QgPWboS5O4LazK5WGOqYZraiErIs1u0vb99Fn3qVSz63W1bWjbH_c_5Swg4CKtIOfGd2nwCvb0Vc0VDdMKGdejxc7wK1woIFPwpuDqAWlDBOBUWGoZ7k1H0phjhaeVXgDgvBAZLIEGG0RgoMjE_n0qA3sxxoNk2_5Y.99Iil3.PN091mdzH9K4JOzspbM8WYkV60IYPPmrJOB76qZLiQcLkyjw93k6c8T8qPELGkZkajWoROQud.6wslVvOQDOOGv90oWRG_d2mjibqZIgKU2uKty5TkRnGXf03_1zBXDQWmDbhjCmjL7ubJsrLgRCDg5IcnAOhv8NPv75ZYsMhqFCHuaIXis4R7hHHH; datadome=7Mf0DCPrnV8hrCFXEwYIVywhFrz8EIgYd3G6BBJSpCduFNmBCzUbaihQrqsmpGaS6g7g02rPsF1dL8UteoqQX1VZ0_rCju4I2FvJSFuewya9IJJGOsmOh2k1vZtwQiGj; viewport_size=496; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Apr+07+2025+18%3A20%3A29+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=282767a3-622b-41fa-9ea8-a0dc1e2ac40b&interactionCount=67&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; _vinted_fr_session=TzZMMzVGdDB4QVppamVRYUc5TE5MNllHc0hzSXlOb2x1V0dRMGRycWpJZWNQMDc0WktLV2FMcXA4ZUhxU09lUk9MeGJ2WFo2K0djWXVJSFd4RkZKd0NmUzlEY3pwaUJneVJOZ1FJcHdlYXQ4WmZGQmN4d3RMdnh3bm95bG5UK2xiY01Gc29YbWpWNFpKLytPK1NhTWl4QTRPSDgwZXFibHlTdEhLdVpZV1lvTEh0eWxOMGo3b3dSSFI0OHVVRndlbTN6KzFRNW9hMUIrVktxbWFxMmwxY0xHN1ZqSmFmSG4vSE9OakNZY2o2YXJ2Tnd4a2Rpb0djRWNJZFBXTWh1c090ajFsOVJ1Uyt0Vkd6bkdyc0piMUhZSWxiOEJuMElEKytBSEc1T1dVTnNtRjlJZUo4bjd3TEFrVExMV1VNOUpjcWtzV0cwejQzVFJnRUpTNG9nMUlOVEVlQmxJQzB3OHJ4djREVWRNREFpQUtoYTA1c1ZQS2x4bklMb29GZnVRVldzNnlFOHZnQkt4R0hoU3Rmd2laeU05ZDV0QUp2WU9RaWdwaGJ4dkFuZjhYbkJPdkIzYTQzUytxenkwdTJpaFVaYktna1dDRktOdnZQSENkSUJzanBPYitUc1lVdDhHS2RGN2gvRTR6a21LNUwzWGhPTUVBR1o5aE1sVlh5dzh1ZEhzM0g4NlBFVHM1VzFTM3J3d0VBRklvSnZYY0hmVHd6dE1uRTZQUFFpVmZobmxjc21Ic1phNnAxRHR5d21XZzBnRlJEOGF0NzkyeFhxeXBMNzJBOEZKb2VYVnBoY1BiaEw1ZmxYYkdCQlYrekpmOHErTXpVcnFnOTFnWTZodDlVVVZidUJSWXYrS3pUMXMwbjFxRU5kbEtqWU1OaFRrUlNOd00rRlNMT2xDN2tqczJUMm1RY043eDFPYlBFcGtPQXNwNjJldFRmdFIvbHF0TTBjMnVlQlBjRGdZbFUzVjBSc1F2d2lRWHFPYWNETFpab1BUVGs5RG4vV0xDb0ZZV0xPUHgvSW4vL2V1cnZXY3hSN2Y4YTBha1lTVll4c1RQUmZ6ZjlqTjhQSGlITlRacFdEZkw5VU9IalBSUDlCWDgydlU2M0lWZGdNZlZJVktLVndVMGxybkExUWNybHJBSDZhZ3FIR1F1Q3V4bnljUmUwRWlMU0VhbzB6V2pESXpWZXN1L3hqUlZGc21qNE5TbFVlWWdUTmkycEdzTW8rK1NaWjRuY042KzlUdWlCSmlNdFlkcnp2OU9oVytaMTdqbU1YRTY3eCsxVFlXWXhIUHJNMCtMZUQ2RkZacUpRTUtTU1Zkd0ZZWUcyTGdSb082RXpZU2ptTUFCMjBkWmd6VURrMmRPaWJKYUp0dUd1dUtwa3R4dFp4NC9jZGl3ajEzSkJpajB6UE4rTlJHdmFNc1I1VE1sVG1mdzNnVEpzL2doR3F1V0ZGRUN2NFFsVzQwQXVRNHM5a0tBdHBkaWVyUnBhVHVobWs1cjk0WG5oL3RPUVdsbVNXTDN2N0tHWFhPSVJyRGNkL3BrYUZkS0ZQcFBuWFR0U2xaK0dVR0owbGhuNFpxenZya3VDOHh0T0lwQU5RdDFCM2FRODdkelNETGlPZDd6OWNYeWw2bHN5eGd6cHl4U2FOTjkwZy9ucC93eEVJeVE2WUJ1Q2NYN0h3YjFwbERWa3dBL25ZalRZUURNY045dVNaRWpXSHBVVVp2aTdhVlR4anN4MVNTR3k3RzhUZFVGdVlPRkVZQ2czdnRXaS85N1JxS0Y2SFZ3aWdhSHRUWWszcnZUNTdNR21iaFpXeEVwMzNSV1FYRzBpbG9JVlNCRUNBMWhjc2R2QUp1NGFPL0cxVmcxYlFtRXY2cW93WGRlalVGYnRpRVhLaFg1UVBjcXYzME1CQWNvUG1QbVFFQ2RaUzhzYWppdTFUdHlqQjJQVjhuRjFETEFyU2NPdzNKVkE2Z0h6QVpWWVhMcnVDN0JEQ1J5dmJNaTN2cVNaT2JRZTdNREhFLzJubVNGaEZPclJTRTZ6bVVmUTlLL1BmaXBYendwQk9FdUxaclo0K0VuMkRWWDZpbHhpT2VkdGlDTnpxbGNReVlva29sTk1vSVBQcVg2Y2dVTkFuNTVGb2Z0U3hQV3NLM3dvSUlFVFgyK2pSYnlIVjllaTYvdHg4TnZHT0lXd2t0WmxPbzIrQ0pKMm0zNlBmUmV5UTBGWVZ6QlJLMmR5MCt4YTRNS3lPUXhiOWF2M09CNWNTWlBhNFhFeFl2TTgvc2pxUDBKR1ZqSTRJV3VtWVZhRzlXdFRrc0twSkdWekZuaU1OdmhMaXlCK2ttbWdaRHRoVkJHMlZuY3VDZnZmNlBKaW1mb3FRZzlYMXVHY1ZmV2ZueC0tc2d1alhNelRlN1hMdE0xQWllajkxUT09--80605487e71ac1e1747c6a83ab0f02c1da68c27f; banners_ui_state=PENDING",
         
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