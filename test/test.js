const LokaliseAPI = require('../lib/index.js');
const CONFIG = require('./tests-config');
const lokalise = new LokaliseAPI.LokaliseAPI(CONFIG.TEST_TOKEN);
const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-json'));

let newProjectId = null;
let stringsProjectId = null;

describe('Lokalise.co Projects', () => {
	it('Add project', (done) => {
		lokalise.projects.add({
			name: 'Test project',
			description: 'Test project description',
			base_lang: 'en'
		}).then((data) => {
			if (data.project.id) {
				newProjectId = data.project.id;
				done();
			} else {
				done(data.response.message);
			}
		});
	});

	it('New project created', (done) => {
		lokalise.projects.list().then(function (data) {
			if (data.projects.length > 0) {
				data.projects.map((item) => {
					if (item.id === newProjectId) {
						done();
					}
				})
			} else {
				done(data.response.message);
			}
		});
	});

	it("Import json file to project", (done) => {
		lokalise.projects.import({
			id: newProjectId,
			file: __dirname + '/test-en.json',
			lang_iso: 'en'
		}).then((data) => {
			if (data.response.code === '200') {
				done()
			} else {
				done(data.response)
			}
		})
	});

	it('List pairs by language', (done) => {
		lokalise.strings.list({
			id: newProjectId
		}).then((data) => {
			if (data.response.code === "200") {
				done();
			} else {
				done(data.response.message);
			}
		});
	});

	it('Add or update keys and translations', (done) => {
		lokalise.strings.add({
			id: newProjectId,
			data: [
				{
					"key": "app.slogan",
					"platform_mask": 4,
					"context": "",
					"description": "This is our slogan",
					"filename_web": "en.json",
					"hidden": 1,
					"tags": ["main", "whatsnew"],
					"translations": {
						"en": "Localization made easy",
						"ru": "Локализация – это просто"
					}
				}
			]
		}).then((data) => {
			if (data.response.code === "200") {
				done();
			} else {
				done(data.response.message);
			}
		});
	});

	it('Remove keys with translations', (done) => {
		lokalise.strings.remove({
			id: newProjectId,
			keys: ["app.slogan", "repoName"]
		}).then((data) => {
			if (data.response.code === "200") {
				done();
			} else {
				done(data.response.message);
			}
		});
	});

	it('Export projects locales', (done) => {
		lokalise.projects.export({
			id: newProjectId,
			type: "json",
			export_empty: "base",
			langs: ['en']
		}).then((data) => {
			expect(data.response.code).to.equal("200");
			done();
		})
	});

	it('Export locales files to path', (done) => {
		lokalise.projects.exportToPath('./test', {
			id: newProjectId,
			type: "json",
			export_empty: "base",
			langs: ['en']
		}).then((data) => {
			expect(data.response.code).to.equal("200");
			done();
		})
	});

	it('Check exported en.json', () => {
		expect(__dirname + '/locale/en.json').to.be.a.jsonFile();
	});

	it('Delete the test project', (done) => {
		lokalise.projects.remove(newProjectId).then((data) => {
			if (data.response.code === "200") {
				done();
			} else {
				done(data.response.message);
			}
		})
	})
});