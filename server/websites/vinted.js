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
          "cookie": "v_udt=bmQ0cnF4US9nQUd1bTIvWS9MTmtmVWhNbXhIVy0tSFBWSGFZakpRY1RDcFZmeS0tVUtSWHVzVnhoNS9kQnAxRThkZWhCUT09; anonymous-locale=fr; anon_id=282767a3-622b-41fa-9ea8-a0dc1e2ac40b; ab.optOut=This-cookie-will-expire-in-2026; domain_selected=true; OptanonAlertBoxClosed=2025-01-06T14:48:07.256Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=12d1cb8f-1743105159; __cf_bm=49WNF0pe.1ZTdIe_BylVvhMti0CfpaQ9KPmnMbw4Wm8-1743930751-1.0.1.1-ToIQLUrlmU.Gr2qH3fGxLY6iDmGj6i7Rj6IwCKspDzgS9eLT0g.cOoJ6YSrxTFru2wmaPZ.mWCw32OPo9GG7ThPoQSKtR1I2gp893MaMF8hRco527z9vfZHnaSU_kCc2; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTMwNzUyLCJzaWQiOiIxMmQxY2I4Zi0xNzQzMTA1MTU5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5Mzc5NTIsInB1cnBvc2UiOiJhY2Nlc3MifQ.Ub8E3NOAJTUr6vPh3Pxh-2WfT2HZc05UN3-GlMtgNmtXM8vd-2XCow1Tx4LCQcN6a2BxVB0m3OG6e7XAhUnNxdx3_mnuTT8R_bWqRKLTutsmhjN-ZC8ziWKoJDKGhIZAX_tb2b99IvuvdQmhgGwNMDZrl9wXNxDF938pQAEXsBwPR_TV1FBkCqR4boQZuF3woBw7DUCPmMWD9CnjwS5docxOESksXPbsOXsS0jdPEHJ8Ll9mFF1DQYiq2zzXADIiPrDrvVCCV6YHJX5uxSt5xGWxE4G2L5LJlgqWQc7IABNeaSbJAHZBzYtKaII5xsQZB1N9anOGN9M20RdpAYWdPQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTMwNzUyLCJzaWQiOiIxMmQxY2I4Zi0xNzQzMTA1MTU5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1MzU1NTIsInB1cnBvc2UiOiJyZWZyZXNoIn0.y0n5Lbtu0VqCeaW5b6u4RoJ5fBBpOyX-kfKV6r8uT2aeavHebvA3wVs5Hcj01pOyzkYrE7NuxFr2tfNcg64oMAqTcJefLc_m5E7gvDGwdjJCdvVmiaISI7E1wxQeuckaxKWMFS238Fiz3qFd4D2apXA3qT1hwpQVaN-r6s8ZkWKypGmERm58MSU770NRfXoBukDW-aiY2hSqXhnY1q9Kvvj9yF6PM_sA3XTa0TiLr7cvJ67CUihNCoTmToMz9QkQY1Ri6wjfatSjpmTHbPsxUvOTN1LkCCscBNFsbK6YLJpNKQEgvhFAc1lJb4ZHMgwjfqoZ2HYKZZ3y0ooObvU-9w; cf_clearance=K.pd9FQvsheztt1BhpHhDHyl4e4GX6l_d9Zgh8PPA1Q-1743930756-1.2.1.1-.HS7cIib9ajKR1qTxc2svrQfBu2QmeQL4NgSVwvg3tsvrgJdK.8.M1bDUdwj3eP5Cxghu4r6l4l194LhwQWwDuT4Eu6F5SYUBmTO2HoBYYT46K1WBj8xjtb8XrIA_muDo8CQFkr.3ZSS5vRLM5KEbZz1JjE4k7t4WeyLAnaU9dWmbor0.1Uf2Z5eFs_yCidatckvM7DFNffvRDiO46VtTwxVMmCQHToxnITTaMXw7iIn7Df2DRcwqv5m0x356.FRA9dIvUVkMAr67tRm2Liz8moG1NW8GKDtV3PStlS.HZiTeeefN9vThzBnAdJjRMU9zzV5vbpp2FGeBEsvLUDRv6Ar8Jf.OmS6fl9bVbjGfh8; viewport_size=446; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+11%3A15%3A41+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=282767a3-622b-41fa-9ea8-a0dc1e2ac40b&interactionCount=50&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; datadome=XL~fOhrHvR5F5blzidBVieicF10o6ZCOLP5zJN4gRMn9xWHO2fK43mMK9poWEBqWG5_P7SqCVuq8JwmbcfCGOGzMhOuld4O6x078rQR9QaqLQYyQmycUKawn2r_YWv9X; _vinted_fr_session=cWI0b1dacFRQVFdLSlN5YjhDa09sL01mNFE2SXdkT0dLUVZOZm45SFZ2R0JLTkVCcm9kNks0TTJmVDAxQXZPZ1RuRFk1QVh5VWI3aWljNEVoWWI2UklGWUZ6eVM0Mmt6WVIzNGx2dmZnQXdvbmFqM1dxMFNkS2JlU2gxRDRveU8vQzFOQklBdnBDdjM2RGJqemo2SGRXZkxONmEwMjJCanp0K0dPOVFqY3hGQW1TNVlZTTZKZlMyRjJiWGhCYjl5OFJWRXJnYnJLdXBUWE5XZldiTXdJcU4rTDJRc0xXTWRaOHdtUUxDOVExWWlvb2NBcDhHbzJRNXQvdFRJdHh2Qis3eVNpOWJHTUpub3l1ZWVIcHVTMisxRjBjaFBvVHJjaDBPNlNrZk9PcnNrVXRBTzNqNmVCZDJUa1hzVUova3pRVHFJanQ4UklhT05LUDBtQmpsWWtLNE0yQW44cTFoR1pSVkdkVlJ5K1dPWGptcm5pMmM3NUxrQ1NXUHdneU9jbWcwbkJaRU0rY3ByRDduNHczTUh2cVRQTEtJdEgyN05JMDh3NUQ0KzRNZGlwWDdTZUFId1BrRVdEbVNRaXd1cE1PYldhNVJkYVFrc0lDOEhDSXUvS3F3OWtHc0NaSHlmbDh4U0tGM0ZMSlNqTzRDSjJuSXF3TktMU1lyOGIvOVBkMTVGMlpic0FnaG9xOGtCbTl6U2x2VU1US2JaMFlwWTJIZms1M09NWHFrblpuMXJGTy9OYlFYRnQ1ZHBmcEdZRkFyY0hvYTlVMThaSnNVTEVDNGk2eTN6d2dRMk13NGFBSUVvR0JmY2NrbzZ6Umd0SmZER09LU1h1akxpMXlaNmRyY2trY3llTlB0ZzVyU0FKcFE1K2Foa2pScldMMm53aS85UFYrSHJ6emVzNXI1dEZCTXpRQktwM1R6cWpjejRQQUFPeHM1eDFZSTQxdXJnd2FoOXlrNjVYalFnUUl2OE5Nci9nVThxMHJmdEZ4YjZ6UDBoUHRJMmxKSjkyR0k1NzNpckd1OTM3dDRITHdKaWNjQjAvclREbHM2YWticzZ1WFYrQkxuSmhXcTlKaFpzalhVM0FGc0FaT2dyUk10eGttcTBhL1FVR2dvcU50aitSQzY3K2xiN25YOHpMNDlZMHFJMXlFQWtUMkZtOGZmU091czdrcDQ0UFN3TnpCSjZyOTd1bjVtRVI3REg0eHV1UDhQa0tPVFZ6ZzZqYTRsMGpQZ2p6NWZJWEtVTS9MbWFLaWhBcHhEN0RjMThSa2ZQam00MHNsSE9vSGJHWWRvbm1aaCtwcnc5VkM1Z3BRblB6VG5ZUUlOdzlLSkF0RGFOMmRoRmJiMWlZd0d2VmdhL0N4Q1hkYzVlOS9QVGhjU2FERGxoYXJrSHVHbnhsaGlmQVRsdFgrdVQ3dEhCcnc5cVd0dWdaL0E4YW1WejhmTUZLMmxFNHZtTU1FL1ZNNHJSTFoxK1dFaEdhVFU0OFZFT0RRWHRlampJaFlPVzFGcVh0SHJXMzdaakpvRHkwTHZPZWNBMmJJMThoZmFvS3JzeVgyK0h2WmVEQ2MwRldKd25mRkZITnNMbmk2TGZkbjg1TFEvTUNQS0tnZ2oxSzZPbTIzN1hyaVJNbnl4TC90QTQxVWVldmo4VVBJM1d4dHlLWThBTEtWRHBiMGpKTGE0TGFTd3RaYzdDQzE2WkFrVWg3L05tRGJGSnBEM0U1Q0lKdnFCcTMveDM0TzJKMzJGOWFCUFpQT2YxSENDVXhSZGFnU2VTcVZXZ1RwNVYxN3ZwbEE1RTUwTElKNXNiZVBTUWU1Tnpxa1NUaVBTYm1Pc0lTSVh4dTJsVnIvbjRSQVhhcHJOa24yd1pXRHBmUFMzSVNoWi9Bbk1GOStOT21MMWdtYWkxeHhZaHlQMU9VUDhTTW1YYzB4L1dpcjU0L3RwNE9DTTQxTVB3NForMmhrTU92cllCWHlUSkZiTml1Z21oT0V2cDRXdVhzc3ZqZHdlRVU4T2pOWUF4ZkVWb2hDVEl6TzZOWUhtazFScUk3dVBaSHAxNllZeDFmRzdNVW1aamRsVzdwU3Z2YTM4NkJwWU9lMlJHMG91NFB5R05sNkYzcmtLM1Z2Tk9BN1Z5b1JlY3Y0bUFrSC9kWVFmTExjRENlMGV5V1VSK1hWUnNsWk1kdUgyYk0yMHV3Q0V5R3NscFZFR0RIYjRmVEFtS09wSGtMZHk2KzlId0d5Z3F3OGYrMDlxUnd2Q0ZCQXBHZ0U0bGNTR1dZVUFrVUp1NTljbnlteitwcXN4ZlVhRjlWVFUwUVJnUktpeUVHUi9BSVY2VGVodGlBRzJPaHZBZXFubTVEU21HMHoxRCtnNTVGU0FFWnV1NElsT0lyeXpZQ0NZbi0tRm9iaThuclJIYXIvNzVqMnJTVG5mUT09--28ccae9e3bc1e4ef8e87024dbc4bd6818730c48a; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?search_text=LEGO&time=1743930904",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

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