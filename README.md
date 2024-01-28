# PDF_Splitter_GPT
Splits a PDF by sending it as images to OpenAI and then uses its response to create new logically split PDFs according to their contents (it's not always perfect needs testing, just a proof of concept)

For example if you have a pdf with a page that has your ID and 2 pages that have medical documents, it'll create 2 new PDFs one with your id and the other with the 2 pages of the medical documents.

Takes a pdf as an input using the file explorer then it takes an OpenAI key as an input
