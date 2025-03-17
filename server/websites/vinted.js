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
          "accept": "application/json, text/plain, */*",
          "accept-language": "fr",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Microsoft Edge\";v=\"134\"",
          "sec-ch-ua-arch": "\"x86\"",
          "sec-ch-ua-bitness": "\"64\"",
          "sec-ch-ua-full-version": "\"134.0.3124.66\"",
          "sec-ch-ua-full-version-list": "\"Chromium\";v=\"134.0.6998.89\", \"Not:A-Brand\";v=\"24.0.0.0\", \"Microsoft Edge\";v=\"134.0.3124.66\"",
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
          "cookie": "v_udt=bmQ0cnF4US9nQUd1bTIvWS9MTmtmVWhNbXhIVy0tSFBWSGFZakpRY1RDcFZmeS0tVUtSWHVzVnhoNS9kQnAxRThkZWhCUT09; anonymous-locale=fr; anon_id=282767a3-622b-41fa-9ea8-a0dc1e2ac40b; ab.optOut=This-cookie-will-expire-in-2026; domain_selected=true; OptanonAlertBoxClosed=2025-01-06T14:48:07.256Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=53d1caed-1741612271; __cf_bm=UA99U1zYFjpsYYF0BO8McbUT27UVKF4E1bhQYUqNWek-1742225350-1.0.1.1-ihveDJXx15.f0WmPB797VTvMor3LOUVTn1tVv0gtgtA37YZ9nRjxi3j3Vh5jjLhWLq8xI_DQCXhG1FIHDoLzOb0YxD6ye_qHHor.TrnVgfhFQGAXHC3wrTlNSH36YxM7; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyMjI1Mzg4LCJzaWQiOiI1M2QxY2FlZC0xNzQxNjEyMjcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMzI1ODgsInB1cnBvc2UiOiJhY2Nlc3MifQ.Klz_eH0P_M5D2hrtCzzCJddM2tCdNkW6mXnjHn-02L0GjIl1ijMcVPO8CyQDIlv3EjRHe67B8J3_LzK3jlhnUb5Aei8bwwCCvEc4w9SLXUURTf5dyECL6awa15OEasLx1E9JLxh3YNOnPsKEpCvSw0-947RrhlggyIKT2txZAo7qTqkju9WxFDA--NpKkYzvsPmtYFtD98BDynFeCK31R9wggZ7VssyHDkUL_LEzq4nXm6QJOdtULHZOVnnkfN7uH92gP8aV5XczD41fOnIooIG7Vv11Amklq1hL9Th_Ra_MJpUa2qkoESgkNuDdRw8bVyprWwIZmRhvpGJlqRPrsA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyMjI1Mzg4LCJzaWQiOiI1M2QxY2FlZC0xNzQxNjEyMjcxIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDI4MzAxODgsInB1cnBvc2UiOiJyZWZyZXNoIn0.u8QBMcXHAbha76l1OcCjL4JOaNWY0qEG9PTwIZJIFMosHR5jjST71cnQMMpGuuOH3ewRg6sxBxAhcpts9ffTqmeb5xy-YReAxWbKAThJcM0yLu4g07-1m17DzIxXdF3euEyQfpVTVonXGkXbLYQcT9ChQonW0BVLC1eTze9XRz44Ac-oGn4ndo-l_MU_2PG_hK-5wITdYNUiqJ_-Bx5LE6B_7lJ71jlV589EVjnCJRnz35Xv3Qzc4iWG7M0KMP7p4K2qh3jgJjpZOWAEW_l8IN4yjgzfbwJiv6q53MngijF5VZ5_v20GJxYziTyoppZhW28eYoBiR1IcGTtM6B7tJw; cf_clearance=.b4_0JZG.lHqT7v.ycVi0oDgsdLI4lQR.pD3Fa0qHUg-1742225388-1.2.1.1-yRgAbHriv4eFlmN3RCZxFtpApZvV1J__SiyjMJiZ_Dc9OnPNL.sXeHK9t.wNhjhfXbWyr0hhbMmXQoxGyOkHwptHYYutpbpl0hZqNsAIBi7IKx7t0eKuQ1u6oGRLRVKtuXAxdNrrH07yHm2V9xwceOYLh.Ji02XkxFC.IEFzbMYBSrAXPAYvhkNrxrhaOb4gHPbiKJrVNT7lIy.qXdYWo4QBBct1GghhPJa_1JChnMg.R0m0U2AKXLT1jv2nzJZi0Sug5V3fixEfkwJvEuHH0Obn4m4sk.i3pFHSjgJQhopLG1OrM8hKpD6hAhMvvo3xg65_XDw14aZK8fmOasuhfxnvU4Pc35H6C.Ra47_g2eQ; viewport_size=530; datadome=ZR8Aw5~Hh1fssF7LgziUM~~BhQFNLmCXzSrHYD5odv3JhYs3692iMEJ8eZr23WVFAYRe2wsIkal9NmrhmeqXmDQL3IxyKqoHF3WkW2A7jfxnNj0Kp89Abh1Tf3DVT1Jk; _vinted_fr_session=MzVHL1RKVDFqUXZmbXRKY3YwbDBDVUVmc25yenAraUNBWUdsZzZkMGF4Wmx3d2xoakNLQWRNanF5ODZJdEJkVVYyOGZ3aFZ5UHY0aStEaTFBRmduZFJsRklQM2hMZ3F0ek1idFJGYXlUM293Zk1nbERyUE1IdmNsUzY1dW00RHpmOVp0bEtaTmFnVlpTK3BtSm50N1hBcXFYWGFqd25tUXVPSm1ldmNqZzhZUlBLOU95cmRHbkxKSnhMV250VGRrUEpVZUJsUGtLOFlEWXBLOEU3YUs0d3hVZ0N6M2J6c1NIeEY5S01PUEQ5QjdJQktzRWR4UWFvSEVXcWMzOWNja2U2dWxGN3ZhNDFrWkhzYVdibHBTWG5lUFE2YXBYZmhWZGJOdVBXbktFWlVxNnpnOEJDMGFSYjh1bC95bjdBdmFIRVdWTlZQNFc0UnBSTEFjcWNSOUNpZGhCVkc5NUZ2TTVaTDJScm9oSUNhbnBEMlJSaThKUVlzVU9pQkhoRzBJQmJYMmZYblBieGpVZEJkSlhCUTBNNHg5d3ZnVENFK0R1NFhDYkVWbnFiYXRuQlRneXF4K1hWYWxocWxDdFhkSUdOalYwNEJWOVJYTmJON2lEdDMrU1d0ZXhXcVVLNmhMME5RMytkZDdXNklwc00wTWR4QUo5ZmtNa1RrVU1LK1RUTHRDUXcwT2Z3bjJTZThvZUhranB5dEI0OWhlcU5xMFNSRjhtenFvakRaRkxwb3F5WlJQTmRjQ3FMSlJwV1NMZkY5b0h2TWV6RkdlSXg2c3ZQanVTMndacWlYUVRaQmt2TzROZWNTV2JyRmlNck1GV0Rzc3NnQTh4UnhCcjFCTDFrdDhxd29zQk45ZHBWZE9XVkRWZ3I3YUs4OCtBSjl2bFVtNGRiWjhRYklXMXBJb0FYdit2M0dkVzE4SitZbEFqUFlGcUdBSFhqUk90U2FYMmE0Rm5mSE5ZUXhkWEE5b3VEdzNLNVhUVGN0ZmpGa0xCRnU3WTRzWG1Dck5XWUFmMDNwdTJuNitIL01mVnAxRzRHVCtMOTQzTytpM3oyVyt5dlB3WEdGaHpjWXNWTXkzSUJJL3liZVJRNFNWOGJ5ZFU3MTdwQVltQ2F6U1N2NGZtbC96OU9EL3dFN3BWVS9VVzRRK2lmY0RLWlpsK0pBL0IzcXNZdFdjby9pR1pKN3pad0xjREpCTFdsRzJnZ0ZDUis1MzB6bzJZSklNMUtWeWJIMmlrRno3Q1YwaWdVNGFoZjdOeDRMREVmMy9WS0cxRUJ6MFkxK0ZSdFEvYzJaUWlnQjZUN1gvcHJpRkZ3Y3RMQmdqdmt5UWNlUmJEdmNtSldvWk9HVTlQZVJLdmZyV1huMVovUU1kRWZITUwzNXB5SG4vb2xrQkMyZ1g4eW80TWQ4WG44bHVOWkU2dGczajhEeUpmQTNPc3B5Qmx2MnlrQzlUa0c2MTVWbGVXSnozTzhhZlp0UFJWcWxSK3hQNkxVbFMxTEg5MWhuczZibndGcDBJaXdtTXJvbUtCNFEzSnFjcXRyZmZUYWE4bWIrTVZLS2trYUNYZzN2amkyL0hmL3dyd3IvOEQvT2NmMzZHTjBGRGY3YmRQM09oYVo1TXVJeXFvUVUrMWRteXN0N3lSZjZYSlhXU29lM3NMeU05VUZZaUlsWmpRT2NDblc4L2lvRDVjbmhNV2dpbC9VZjlPV3pSVG43MnZWOUJSK1JKZUFkN0RWcFFFV1R0NUxPakZIUVFNYWxRMlBEUDZTVm5BNzZrVmkrM3JSVHVqdEprbnBrcVVoV0g0NE41VGE4VmVuK2hhMzRweEdtLzkzejN6YnhnYko1TE1QY29JNnVmYksyT2h5NCsyZVRJVjBzL05aaFE5UWpJVDlxelgrY01DYVZ0TFRjWFBvWEp6c3FodFBNVUYrZUt1K0FMUFRrRlNOWjhobisvRklHZ0RsSUMzUDRHWHpGTTNXVXBYTm5SRktVT2lXdXVjU2V2eVVuTmJLblBLMmVudUlJMnQyd1AvZjJKcG80dkwrRjhFMWtaaW1IU0ZPZjFWanB6MHVuMXdUNEljS1VFRXErY0J4akROcEcyMkdERjlzZVJrSStRdjBHRFB1ME5ZNkRpQXZWdVBab2NQMHRZQU8xMXhRcnJteVF4VVlXT1JYSkQrZWx3RlRGSUNjNW5uOExXQlBBamxKcENhWHhsQ0MvanByYU1EQ3lCNlY1a2piMmc2b3JaZVNhYXpFcEJ3ZzUwTGpwSXdHYUpuTXU4dHJickh2enV5bkkwSjlHdHdjSTFEUzhLcG5qOWw0bDlKLzVqMW9IeEhhdGJtU2FQbnc3OFIvUnFxblIwMW93dlhNS0MxZjFTdUpYWkxraml2TTFBTk1EWS0tVnZ6VmJzRmtleHE2SjFkdnRSaVNZZz09--37bea4380d96b0841b0607e84063c26a32d00490; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+17+2025+16%3A33%3A22+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=282767a3-622b-41fa-9ea8-a0dc1e2ac40b&interactionCount=33&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?search_text=LEGO&time=1742225535&currency=EUR&page=1",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

      // console.log(id);

    if (response.ok) {
        const body = await response.json();

        const sales = parse(body.items);
        
        fs.writeFileSync(`lego_sales_from_vinted_${id}.json`, JSON.stringify(sales, null, 2), 'utf-8');
        // console.log(`✅ Sales saved in lego_sales_from_vinted_${id}.json`);

        return sales;
    }

    console.error(response);

    return null;
}