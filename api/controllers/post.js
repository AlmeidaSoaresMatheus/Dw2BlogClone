import { db } from "../db.js";
// Importa a instância do banco de dados (presumivelmente MySQL ou similar)
import jwt from "jsonwebtoken";
// Importa a biblioteca JWT para manipulação de tokens de autenticação

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";
  // Constrói a consulta SQL com base na presença ou ausência de um parâmetro de categoria

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
  // Executa a consulta no banco de dados e envia os resultados como resposta JSON
};

export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";
  // Consulta SQL para obter detalhes específicos de um post, incluindo informações do usuário associado

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
  // Executa a consulta no banco de dados e envia o primeiro resultado como resposta JSON
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Não autenticado!");
  // Verifica se há um token de autenticação nos cookies

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("O token não é válido!");
    // Verifica a validade do token

    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";
    // Consulta SQL para inserir um novo post no banco de dados

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    // Valores a serem inseridos na tabela posts

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("O post foi criado.");
    });
    // Executa a consulta SQL de inserção e retorna uma mensagem de sucesso
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Não autenticado!");
  // Verifica se há um token de autenticação nos cookies

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("O token não é válido!");
    // Verifica a validade do token

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    // Consulta SQL para deletar um post específico

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("Você só pode deletar o seu próprio post!");

      return res.json("O post foi deletado!");
    });
    // Executa a consulta SQL de deleção e retorna uma mensagem de sucesso ou erro
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Não autenticado!");
  // Verifica se há um token de autenticação nos cookies

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("O token não é válido!");
    // Verifica a validade do token

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";
    // Consulta SQL para atualizar um post específico

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
    // Novos valores a serem atualizados na tabela posts

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("O post foi atualizado.");
    });
    // Executa a consulta SQL de atualização e retorna uma mensagem de sucesso ou erro
  });
};
