const LokaliseAPI = require('lokalise-api');
const CONFIG = require('./tests-config');

const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);

lokalise.projects.add({
    name: 'Test project',
    description: 'Test project description',
    base_lang: 'en'
}).then((data) => {
    if (data.response.code === '200') {
        lokalise.projects.import({
            id: data.project.id,
            file: __dirname + "/test-en.json",
            lang_iso: 'en',
            replace: 1
        }).then((data1) => {
            console.log(data1);

            lokalise.projects.remove(data.project.id).then((data2) => {
                console.log(data2);
            });
        });
    }
});

// lokalise.strings.list({
//     id: CONFIG.TEST_PROJECT_ID
// }).then((data) => {
//     console.log(data);
// });
//
// lokalise.projects.exportToPath('./', {
//     id: CONFIG.TEST_PROJECT_ID,
//     type: "json",
//     export_empty: "base",
//     include_pids: [CONFIG.INLCUDE_PROJECT_ID],
//     langs: ['en']
// }).then((data) => {
//     console.log(data);
// });