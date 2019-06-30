/*

  _           _                            
 (_)         | |                           
  _ _ __  ___| |__  _ __ _   _ _ __   ___  
 | | '_ \/ __| '_ \| '__| | | | '_ \ / _ \ 
 | | |_) \__ \ |_) | |  | |_| | | | | (_) |
 |_| .__/|___/_.__/|_|   \__,_|_| |_|\___/ 
   | |                                     
   |_|                                     
   
   tool: scan text in image documents folder
   date: 20/05/2019
   email@brunodasilva.com

*/
   
const tesseract = require('node-tesseract-ocr')
var exec = require('child_process').exec,
	child;
const config = {
	lang: 'eng',
	oem: 1,
	psm: 3
}


const testFolder = 'G:/IMAGENS/*/*.{jpeg,jpg,png,bmp}'
const fs = require('fs')
var glob = require("glob")

var maxThreads = 10
var currentlyThreads = 0
var currentlyFile = 0


glob(testFolder, {}, function(er, files) {
	console.log("Iniciando varredura arquivos ...")

	setInterval(function() {
		if (currentlyThreads < maxThreads) {
			currentlyThreads++
			let arquivo = files[currentlyFile]
			console.log(arquivo)
			tesseract
				.recognize(arquivo, config)
				.then(text => {
					if (text.search(/BRUNOSILVA/i) != -1) {
						child = exec(arquivo,
							function(error, stdout, stderr) {
								console.log('Image opened');
								if (error !== null) {
									console.log('exec error: ' + error);
								}
							});

					}
				})
				.catch(err => {

				})
				.finally(err => {
					if (!(currentlyFile % 1000)) {
						console.log("Até agora verifiquei: ", currentlyFile, " arquivos");
					}
					if (files.length == currentlyFile + 1) {
						console.log("Todos arquivos foram lidos e nada foi encontrado");
					} else {

						currentlyFile++;
						currentlyThreads--;
					}
				})

		}

	}, 10);

})
