import express from "express";
// Importação do framework Express para criação do servidor web
import authRoutes from "./routes/auth.js";
// Importação das rotas relacionadas à autenticação
import userRoutes from "./routes/users.js";
// Importação das rotas relacionadas aos usuários
import postRoutes from "./routes/posts.js";
// Importação das rotas relacionadas aos posts
import cookieParser from "cookie-parser";
// Importação do middleware para análise de cookies
import multer from "multer";
// Importação do middleware para manipulação de uploads de arquivos

const app = express();
// Criação de uma instância do aplicativo Express

app.use(express.json());
// Habilita a análise de requisições JSON no corpo da solicitação
app.use(cookieParser());
// Utiliza o middleware cookie-parser para processar cookies
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
// Configuração do armazenamento para uploads de arquivos usando o multer

const upload = multer({ storage });
// Criação de uma instância do multer com as configurações de armazenamento

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  // Obtém o arquivo enviado na requisição
  res.status(200).json(file.filename);
  // Retorna o nome do arquivo como resposta
});

// Utiliza as rotas relacionadas aos auth/users/posts no caminho /api/posts
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


app.listen(8800, () => {
  console.log("Conectado!");
});
