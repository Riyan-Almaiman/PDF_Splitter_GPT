
import fs from 'fs-extra';
import { PDFDocument } from 'pdf-lib';
import * as helperFunctions from './helperFunctions.js'
import * as openAI from './openAI.js'




const pdfPath = await helperFunctions.selectPdfFile()
console.log(pdfPath);

const key = await helperFunctions.getInput('Enter OpenAI API key\n');
console.log(`API key: ${key}`);



const baseName = pdfPath.split('/').pop().split('.').shift();
const outputDirectory = `./output_${baseName}`;
await fs.ensureDir(outputDirectory);

const imagePaths = await helperFunctions.convertPdfToImages(pdfPath);

const contentArray = imagePaths.map(imagePath => {
    const base64Image = helperFunctions.encodeImage(imagePath);
    return {
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${base64Image}` }
    };
});

let openAIResponse = await openAI.analyzeImages(contentArray);
openAIResponse = openAIResponse.replace(/```json/g, '');
openAIResponse = openAIResponse.replace(/```/g, '');
openAIResponse = openAIResponse.trim();


const parsedData = JSON.parse(openAIResponse)
const originalPdfBytes = await fs.readFile(pdfPath);
const originalPdfDoc = await PDFDocument.load(originalPdfBytes);


for (const doc of parsedData.documents) {
    const newPdfDoc = await PDFDocument.create();

    for (const page of doc.pages) {
        const pageIndex = parseInt(page.replace('image', '')) - 1;
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageIndex]);
        newPdfDoc.addPage(copiedPage);
    }

    const pdfBytes = await newPdfDoc.save();
    await fs.writeFile(`${outputDirectory}/${doc.title}.pdf`, pdfBytes);
    console.log(`created PDF named ` +  doc.title )
}

await helperFunctions.deleteImages(imagePaths);
helperFunctions.openFileExplorer(outputDirectory);



console.log("Done")
