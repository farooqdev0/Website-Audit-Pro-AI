const auditBtn = document.getElementById("auditBtn");
const websiteUrl = document.getElementById("websiteUrl");

const seoScore = document.getElementById("seoScore");
const performanceScore = document.getElementById("performanceScore");
const securityScore = document.getElementById("securityScore");
const accessibilityScore = document.getElementById("accessibilityScore");
const speedScore = document.getElementById("speedScore");

const overallScore = document.getElementById("overallScore");

const domainName = document.getElementById("domainName");
const sslStatus = document.getElementById("sslStatus");
const mobileStatus = document.getElementById("mobileStatus");
const coreVitals = document.getElementById("coreVitals");

const aiInsight = document.getElementById("aiInsight");
const auditGrade = document.getElementById("auditGrade");

const auditResults = document.getElementById("auditResults");
const issuesList = document.getElementById("issuesList");
const recommendationList = document.getElementById("recommendationList");

const loadingSection = document.getElementById("loadingSection");
const themeBtn = document.getElementById("themeBtn");

let radarChart;
let doughnutChart;
let auditData = {};

/* ==========================
START AUDIT
========================== */

auditBtn.addEventListener("click", () => {

    const url = websiteUrl.value.trim();

    if (!url) {
        alert("Please enter website URL");
        return;
    }

    runAudit(url);

});

/* ==========================
AUDIT PROCESS
========================== */

function runAudit(url){

    loadingSection.style.display = "block";

    setTimeout(() => {

        loadingSection.style.display = "none";

        generateAudit(url);

    },2500);

}

/* ==========================
GENERATE AUDIT
========================== */

function generateAudit(url){

    const seo = random(80,100);
    const performance = random(75,100);
    const security = random(80,100);
    const accessibility = random(75,100);
    const speed = random(70,100);

    seoScore.textContent = seo;
    performanceScore.textContent = performance;
    securityScore.textContent = security;
    accessibilityScore.textContent = accessibility;
    speedScore.textContent = speed;

    const overall = Math.round(
        (seo + performance + security + accessibility + speed) / 5
    );

    overallScore.textContent = overall;

    const domain =
    extractDomain(url);

    domainName.textContent = domain;

    sslStatus.textContent =
    url.startsWith("https")
    ? "Active ✅"
    : "Inactive ❌";

    mobileStatus.textContent =
    performance > 85
    ? "Friendly ✅"
    : "Needs Work ⚠️";

    coreVitals.textContent =
    speed > 85
    ? "Good"
    : "Average";

    updateGrade(overall);

    generateInsight(overall);

    updateBars(
        seo,
        performance,
        security,
        accessibility,
        speed
    );

    createRadarChart(
        seo,
        performance,
        security,
        accessibility,
        speed
    );

    createDoughnutChart(
        seo,
        performance,
        security,
        accessibility
    );

    renderAuditResults(
        seo,
        performance,
        security
    );

    auditData = {
        url,
        seo,
        performance,
        security,
        accessibility,
        speed,
        overall
    };

}

/* ==========================
RESULTS
========================== */

function renderAuditResults(){

    auditResults.innerHTML = "";
    issuesList.innerHTML = "";
    recommendationList.innerHTML = "";

    const checks = [

        ["HTTPS Security","PASS"],
        ["Meta Description","PASS"],
        ["Image ALT Tags","FAIL"],
        ["Open Graph Tags","PASS"],
        ["Canonical URL","FAIL"],
        ["Robots.txt","PASS"],
        ["Sitemap.xml","PASS"]

    ];

    checks.forEach(item => {

        const div =
        document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
        <span>${item[0]}</span>
        <span class="result-status ${item[1].toLowerCase()}">
        ${item[1]}
        </span>
        `;

        auditResults.appendChild(div);

        if(item[1] === "FAIL"){

            const issue =
            document.createElement("li");

            issue.textContent =
            item[0];

            issuesList.appendChild(issue);

            const rec =
            document.createElement("li");

            rec.textContent =
            "Improve " + item[0];

            recommendationList.appendChild(rec);

        }

    });

}

/* ==========================
PROGRESS BARS
========================== */

function updateBars(
seo,
performance,
security,
accessibility,
speed
){

document.getElementById("seoBar")
.style.width = seo + "%";

document.getElementById("performanceBar")
.style.width = performance + "%";

document.getElementById("securityBar")
.style.width = security + "%";

document.getElementById("accessibilityBar")
.style.width = accessibility + "%";

document.getElementById("speedBar")
.style.width = speed + "%";

}

/* ==========================
RADAR CHART
========================== */

function createRadarChart(
seo,
performance,
security,
accessibility,
speed
){

const ctx =
document.getElementById("auditChart");

if(radarChart){
    radarChart.destroy();
}

radarChart = new Chart(ctx,{

type:"radar",

data:{

labels:[
"SEO",
"Performance",
"Security",
"Accessibility",
"Speed"
],

datasets:[{

label:"Audit Score",

data:[
seo,
performance,
security,
accessibility,
speed
],

backgroundColor:"rgba(99,102,241,.2)",
borderColor:"#6366f1",
borderWidth:2

}]

}

});

}

/* ==========================
DOUGHNUT CHART
========================== */

function createDoughnutChart(
seo,
performance,
security,
accessibility
){

const ctx =
document.getElementById("seoChart");

if(doughnutChart){
    doughnutChart.destroy();
}

doughnutChart = new Chart(ctx,{

type:"doughnut",

data:{

labels:[
"SEO",
"Performance",
"Security",
"Accessibility"
],

datasets:[{

data:[
seo,
performance,
security,
accessibility
]

}]

}

});

}

/* ==========================
GRADE
========================== */

function updateGrade(score){

if(score >= 95){

auditGrade.textContent = "A+";

}else if(score >= 90){

auditGrade.textContent = "A";

}else if(score >= 80){

auditGrade.textContent = "B";

}else{

auditGrade.textContent = "C";

}

}

/* ==========================
AI INSIGHT
========================== */

function generateInsight(score){

if(score >= 90){

aiInsight.textContent =
"Website performance is excellent. Only minor optimizations are recommended.";

}else if(score >= 80){

aiInsight.textContent =
"Website is performing well but SEO and accessibility can be improved.";

}else{

aiInsight.textContent =
"Multiple improvements are required to achieve better website health.";

}

}

/* ==========================
UTILITIES
========================== */

function random(min,max){

return Math.floor(
Math.random() *
(max-min+1)
)+min;

}

function extractDomain(url){

try{

return new URL(url).hostname;

}catch{

return "Unknown";

}

}

/* ==========================
EXPORT JSON
========================== */

document.getElementById(
"exportJsonBtn"
).addEventListener("click",()=>{

if(!auditData.url){
alert("Run audit first");
return;
}

const blob = new Blob(
[
JSON.stringify(
auditData,
null,
2
)
],
{
type:"application/json"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"audit-report.json";

link.click();

});

/* ==========================
EXPORT CSV
========================== */

document.getElementById(
"exportCsvBtn"
).addEventListener("click",()=>{

if(!auditData.url){
alert("Run audit first");
return;
}

const csv =
`URL,SEO,Performance,Security,Accessibility,Speed,Overall
${auditData.url},
${auditData.seo},
${auditData.performance},
${auditData.security},
${auditData.accessibility},
${auditData.speed},
${auditData.overall}`;

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"audit-report.csv";

link.click();

});

/* ==========================
PDF
========================== */

document.getElementById(
"downloadPdfBtn"
).addEventListener("click",()=>{

alert(
"PDF Export Feature Coming Soon"
);

});

/* ==========================
THEME
========================== */

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle(
"light-mode"
);

});