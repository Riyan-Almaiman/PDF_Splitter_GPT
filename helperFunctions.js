import fs from 'fs-extra';
import path from 'path';
import pdf from 'pdf-poppler';
import { exec } from 'child_process';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'url';




export async function getInput(question) {
    const rl = readline.createInterface({ input, output });

    try {
        const answer = await rl.question(question);
        rl.close();
        return answer;
    } catch (err) {
        console.error('An error occurred:', err);
        rl.close();
        throw err;
    }
}
export async function deleteImages(imagePaths) {
    for (const imagePath of imagePaths) {
        try {
            await fs.unlink(imagePath);
        } catch (error) {
            console.error(`Error deleting image ${imagePath}: `, error);
        }
    }
}

export  function encodeImage(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}


export async function convertPdfToImages(file) {
    let opts = {
        format: 'jpg',
        out_dir: path.dirname(file),
        out_prefix: path.basename(file, path.extname(file)),
        page: null
    };

    await pdf.convert(file, opts);
    const info = await pdf.info(file);
    const imagePaths = [];
    for (let i = 1; i <= info.pages; i++) {
        // Format the index with a leading zero if it's a single digit
        const formattedIndex = i.toString().padStart(2, '0');
        const imagePath = path.resolve(opts.out_dir, `${opts.out_prefix}-${i}.jpg`);
        imagePaths.push(imagePath);

    }
    return imagePaths;
}


export function openFileExplorer(relativePath) {

    const absolutePath = path.resolve(relativePath);

    const command = process.platform === 'win32' ? `start "" "${absolutePath}"` : `open "${absolutePath}"`;
    exec(command, (err) => {
        if (err) {
            console.error('Failed to open file explorer:', err);
        }
    });
}

export function selectPdfFile() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const scriptPath = path.join(__dirname, 'file_select.exe'); 

    return new Promise((resolve, reject) => {
        exec(` "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return reject(stderr);
            }
            resolve(stdout.trim());
        });
    });
}