/* MODULES */
const axios = require("axios");
const fs = require("fs").promises;
const {Parser} = require("@lanatools/html-parser");



const parser = new Parser();



/* ------------- Information to retrieve from one repository -------------

- The name
- The description
- The last update date (correct format expected)
- The main language
- The popularity (i.e. the number of stars)

*/

async function searchRepository(research) {

  //GET request to the github research page 
  const {data: html} = await axios({
    method: "get",
    url: `https://github.com/topics/${research}`,
    headers: {"Accept-Encoding": "identity", "Content-Type": "text/html"} //important for good data display

  })


  //Parse the fetched data from html to javascript object or array of objects
  const data = await parser.parseHtml(html, {
    selector: {
      name: "h3 a:last-child",
      description: ".color-bg-default .px-3 > div ",
      lastUpdate: ".color-bg-default .p-3 .d-flex li:first-child",
      mainLanguage: ".color-bg-default .p-3 .d-flex li:last-child .f6:last-child",
      stars: {
        selector: "span#repo-stars-counter-star",
        number: true // Parse value as number
      }
    },
    scope: [".col-md-8 > article"] // Find all element using this scope selector. then apply the selector on each element
  });

  //Convert the data fetched into formatted JSON
  const data_json_fomatted = JSON.stringify(data, null, 3);

  //Write the formatted JSON into a JSON file
  await fs.writeFile(`${research}_results.json`, data_json_fomatted);
  

}

searchRepository("pricing");

