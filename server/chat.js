import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// modules explanation:
// splitter: splite documents
// embedding: text -> vector
// memory: store vectors in the vector database. This is a in-memory db in your pc
// retrieveal: get similar vectors of one vector
// we use the chat modoule of openai

const chat = async (filePath = "./uploads/hbs-lean-startup.pdf", query) => {
  // step 1:
  const loader = new PDFLoader(filePath);

  const data = await loader.load();

  // step 2: split text
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // the size of each splits. each one is 500 characters
    chunkOverlap: 0,
    // chunkOverlap: 200, each splits overlaps with the former one of 200 characters
    // overlaps can improve the case of data losing
  });

  const splitDocs = await textSplitter.splitDocuments(data);

  // step 3:
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  // step 4: retrieval (optional)

  // const relevantDocs = await vectorStore.similaritySearch(
  // "What is task decomposition?"
  // );

  // step 5: qa w/ customzie the prompt
  // change your module here
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  // your prompts. you can diy this
  const template = `Use the following pieces of context to answer the question at the end.
{context}
Question: {question}
Helpful Answer:`;

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
    prompt: PromptTemplate.fromTemplate(template),
    // returnSourceDocuments: true,
  });

  const response = await chain.call({
    query,
  });

  return response;
};

export default chat;
