from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS


from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Load .env variables (make sure your Google API key is set as GOOGLE_API_KEY)
load_dotenv()

app = Flask(__name__)
CORS(app)
# Setup Gemini Flash model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3
)

embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Load and prepare documents
loader = TextLoader("company_data.txt", encoding="utf-8")
documents = loader.load()

splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = splitter.split_documents(documents)

# Create vector DB from docs
vectorstore = Chroma.from_documents(docs, embedding)

# Custom RAG prompt
template = """
Hi! I'm **Nova**, your intelligent assistant at **HasimTech** 👋.
Welcome to HasimTech — where we use AI to power the future of smart business!

Start by giving a clear and helpful answer to the user's question.
If the question is unrelated to HasimTech, feel free to answer it using your general knowledge — and then gently introduce HasimTech in a curious, engaging way to spark interest.

Avoid referring to “context,” “knowledge base,” or anything technical — just talk like a friendly human who happens to know a lot!

Below is some helpful information about HasimTech you can use to answer the user naturally:

{context}

User Question:
{question}

Your Response:

"""





prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=template
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=False,
    chain_type_kwargs={"prompt": prompt}
)

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        question = data.get("question", "")
        result = qa_chain.invoke({"query": question})
        return jsonify({"response": result["result"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
