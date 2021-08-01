const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");




request("https://www.github.com/topics",callback);

let finalData = [];

function callback(err,res,html) {
    if(!err) {
        fs.writeFileSync("hello.html",html);
        let $ = cheerio.load(html);
        let divs = $(".no-underline.d-flex.flex-column.flex-justify-center");
        for(let i=0; i< divs.length; i++) {
            let projectName = $($(divs[i]).find("p")[0]).text().split(" ")[8].split("\n")[0]    ;
            let projectUrls = "https://www.github.com" + $(divs[i]).attr("href"); 
            finalData.push({
                "projectName":projectName,
                "projectUrl":projectUrls,
                "gitRepos" : []
            });
            
            request(projectUrls,getRepositories);
        }
        console.log(finalData);
    }
}

function getRepositories(err,res,html) {
    if(!err)
    {
        let $ = cheerio.load(html);
        let repoLinks = $("a.text-bold");
        for(let i=0; i<repoLinks.length && i<8;i++) {
            let repoName = $(repoLinks[i]).text();
            let repoUrl = 
            request("https://www.github.com" + $(repoLinks[i]).attr("href") +"/issues",getIssue);
        }
    }
}
let count = 0;
function getIssue(err,res,html) {
    if(!err) {
        let $ = cheerio.load(html);
        fs.writeFileSync("issue.html",html);
        count++;
        console.log(count);
        let issueLinks = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        for(let i = 0; i < issueLinks.length && i<8;i++) {
            console.log("Issue no. " +(i+1));
            console.log($(issueLinks[i]).attr("href"));
            console.log($(issueLinks[i]).text());
        }
    }
}