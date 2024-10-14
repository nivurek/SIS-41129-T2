import React from 'react';

const AIPage = ({userData, handleLogin}) => {

  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const fileManager = new GoogleAIFileManager(process.env.API_KEY);

  const uploadResult = await fileManager.uploadFile(
    `${mediaPath}/jetpack.jpg`,
    {
      mimeType: "image/jpeg",
      displayName: "Jetpack drawing",
    },
  );

  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Can you proviide.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
  console.log(result.response.text());

  async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(["Explain how AI works"]);
  }
  run();


  return (
      <div> 
        AI
      </div>
  );
};


export default AIPage;