import OpenAIApi from 'openai';




export async function analyzeImages(contentArray, key) {

    const openai = new OpenAIApi({
        apiKey: key
    });


    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 4096,
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "Instructions: Each image was a single page from one pdf, keep track of the order I sent them. Total amount of pages shouldn't exceed the amount of images I send you.  I want you to groups the images logically so I can create new pdfs from them. \
                         Just return your answer as json while keeping in mind the order I sebnt them. so if there's only one type of document just put all of them in one document entry if there are more return more accordingly. \
                         Keep in mind the total amount of pages and the amount of images I send. If I send 9 images it should only go up to image9 and it should start with image1. \
                         Stick to this format (just an example): {\"documents\":[{\"title\":\"Employment Contract\",\"pages\":[\"image1\",\"image2\",\"image4\",\"image5\",\"image6\",\"image7\",\"image8\",\"image9\",\"image10\"]},{\"title\":\"Course Schedule\",\"pages\":[\"image3\"]}]}"
                    },
                ]
            },
            {
                role: 'user',
                content: [{
                    type: "text",
                    text: "I have sent you " + contentArray.length + " images, each representing a single page from a PDF. Please group these images into documents in a way that the total number of images in all groups combined does not exceed " + contentArray.length + ". Each image should be referenced once and only once in your response."
                },
                ...contentArray
                ]
            }

        ]
    });
    return response.choices[0].message.content
}
