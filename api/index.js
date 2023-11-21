import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
// Criação de uma instância do aplicativo Express

app.use(express.json());
// Habilita o parse de requisições JSON no corpo da solicitação
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

app.use("/api/auth", authRoutes);
// Utiliza as rotas relacionadas à autenticação no caminho /api/auth
app.use("/api/users", userRoutes);
// Utiliza as rotas relacionadas aos usuários no caminho /api/users
app.use("/api/posts", postRoutes);
// Utiliza as rotas relacionadas aos posts no caminho /api/posts

app.listen(8800, () => {
  console.log("Conectado!");
});
// Inicia o servidor na porta 8800 e exibe a mensagem "Conectado!" quando estiver pronto
