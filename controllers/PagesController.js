const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const dotenv = require("dotenv").config();

const { DECIMAL } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const {
  Usuarios,
  Compras,
  Lojas,
  Cashback,
  Logins,
  sequelize,
} = require("../database/models");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const telNumber = process.env.TWILIO_NUMBER;
const idLoja = process.env.ID_LOJA;

let client = require("twilio")(accountSid, authToken, {
  lazyLoading: false,
  autoRetry: true,
  maxRetries: 3,
});

async function enviaSMS(tel) {
  client.messages
    .create({
      body: "Bem vindo ao sistema de cashback da loja nomedaloja. Por favor complete seu cadastro no link a seguir: https://localhost:3000/cadastro?idLoja=1",
      from: telNumber,
      to: `+55${tel}`,
    })
    .then((message) => console.log(message.sid));
}
//define a porcentagem de cashback que vai ser usada
async function buscaPorcento(id) {
  //busca a loja
  let loja = await Lojas.findOne({
    where: {
      id: idLoja,
    },
  });

  //define porcentagem
  const porcentagem = loja.cashback_percent;

  //retorna porcentagem
  return porcentagem;
}

async function buscarCashback(usuario, loja, criar) {
  // se criar = true, encontra ou cria o usuario
  if (criar === true) {
    await Cashback.findOrCreate({
      where: { usuarios_id: usuario, lojas_id: loja },
    });
    const tabelaCasback = await Cashback.findAll({
      where: { usuarios_id: usuario, lojas_id: loja },
      raw: true,
    }).then((result) => result[0]);
    return tabelaCasback;
  }

  // se criar === false, só encontra o usuario
  else {
    const tabelaCasback = await Cashback.findAll({
      where: { usuarios_id: usuario, lojas_id: loja },
      raw: true,
    }).then((result) => result[0]);
    console.log(usuario);
    if (tabelaCasback !== undefined) {
      return tabelaCasback;
    } else {
      console.log("usuário não encontrado");
      return null;
    }
  }
}

async function buscarUsuario(telefone, criar) {
  // se criar = true, encontra ou cria o usuario
  if (criar === true) {
    await Usuarios.findOrCreate({ where: { telefone: telefone } });
    const usuario = await Usuarios.findAll({
      where: { telefone: telefone },
      raw: true,
    }).then((result) => result[0]);
    return usuario;
  }

  // se criar === false, só encontra o usuario
  else {
    const usuario = await Usuarios.findAll({
      where: { telefone: telefone },
      raw: true,
    }).then((result) => result[0]);
    console.log(usuario);
    if (usuario !== undefined) {
      return usuario;
    } else {
      console.log("usuário não encontrado");
      return null;
    }
  }
}

async function buscarLogin(nomeUsuario, senha) {
  const login = await Logins.findAll({
    where: { nome_usuario: nomeUsuario },
    raw: true,
  }).then((result) => result[0]);
  console.log(login);
  console.log(login.senha);

  if (login !== undefined) {
    return login;
  } else {
    console.log("usuário não encontrado");
    return null;
  }
}

async function AcumularCompras(usuario, valorCompra) {
  const porcentagem = await buscaPorcento();

  const tabelaCasback = await buscarCashback(usuario.id, idLoja, true);

  //incrementa o total de compras do usuário
  let numeroDeCompras = tabelaCasback.numero_de_compras + 1;
  let totalGasto = tabelaCasback.total_gasto;
  let valorCashback = valorCompra * porcentagem;
  let totalCashback = tabelaCasback.total_cashback;
  let saldoCashback = tabelaCasback.saldo_cashback;

  totalGasto = totalGasto + valorCompra;

  //Cacula a média de gasto
  let mediaDeGasto = totalGasto / numeroDeCompras;

  //calcula saldo e total cashback
  totalCashback = totalCashback + valorCashback;
  saldoCashback = saldoCashback + valorCashback;

  let id = usuario.id;

  //testa se a mediaDeGasto foi calculada corretamente e se a id foi estabelecida corretamente
  if (mediaDeGasto !== undefined && id !== undefined) {
    //atualiza a media de gasto, total gasto e numero de compras na tabela usuario
    await Cashback.update(
      {
        gasto_medio: mediaDeGasto,
        total_gasto: totalGasto,
        numero_de_compras: numeroDeCompras,
        saldo_cashback: saldoCashback,
        total_cashback: totalCashback,
      },
      { where: { usuarios_id: id, lojas_id: idLoja } }
    );

    //atualiza a tabela compras
    await Compras.create({
      valor: valorCompra,
      cashback_compra: valorCashback,
      usuarios_id: id,
    });

    console.log("Compra atualizada");
  } else {
    console.log("Erro na atualização da compra.");
  }

  // atualiza a tabela de compras com valor e cashback da compra

  return valorCashback;
}

async function ResgatarCompras(usuario, valorCompra) {
  const porcentagem = await buscaPorcento();
  const tabelaCasback = await buscarCashback(usuario.id, idLoja, false);

  const id = usuario.id;
  let totalGasto = tabelaCasback.total_gasto;
  const saldoCashback = tabelaCasback.saldo_cashback;
  //incrementa o total de compras do usuário
  const numeroDeCompras = tabelaCasback.numero_de_compras + 1;
  let totalCashback = tabelaCasback.total_cashback;
  let cashbackResgatado = tabelaCasback.cashback_resgatado;
  let cashbackSaldoNovo;
  let valorResgate;

  //se o saldoCashback for maior ou igual o valor da compra, subtrai o valor da compra do saldoCashback e a compra sai de graça
  if (saldoCashback >= valorCompra) {
    valorResgate = valorCompra;
    cashbackSaldoNovo = saldoCashback - valorCompra;
    valorCompra = 0;
  }
  //se o valor da compra for maior que o saldoCashback, subtrai o saldoCashback do valor da compra, zera o saldo e o valor resgatado é a diferenç
  else {
    valorResgate = saldoCashback;
    cashbackSaldoNovo = 0;
    valorCompra = valorCompra - saldoCashback;
  }

  totalGasto = totalGasto + valorCompra;

  //Calcula o cashback
  let valorCashback = valorCompra * porcentagem;
  cashbackSaldoNovo = cashbackSaldoNovo + valorCashback;
  totalCashback = totalCashback + valorCashback;
  cashbackTotalResgatado = cashbackResgatado + valorResgate;

  //Cacula a média de gasto
  let mediaDeGasto = totalGasto / numeroDeCompras;

  //testa se a mediaDeGasto foi calculada corretamente e se a id foi estabelecida corretamente
  if (mediaDeGasto !== undefined && id !== undefined) {
    //atualiza a media de gasto, total gasto e numero de compras na tabela usuario
    await Cashback.update(
      {
        gasto_medio: mediaDeGasto,
        total_gasto: totalGasto,
        total_cashback: totalCashback,
        saldo_cashback: cashbackSaldoNovo,
        cashback_resgatado: cashbackTotalResgatado,
        numero_de_compras: numeroDeCompras,
      },
      { where: { usuarios_id: id, lojas_id: idLoja } }
    );

    //atualiza a tabela compras
    await Compras.create({
      valor: valorCompra,
      cashback_compra: valorCashback,
      valor_resgate: valorResgate,
      usuarios_id: id,
    });

    console.log("Compra atualizada");
  } else {
    console.log("Erro na atualização da compra.");
  }

  // formata cada um dos valores para entregar o resultado
  valorResgate = valorResgate.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  valorCompra = valorCompra.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  valorCashback = valorCashback.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  cashbackSaldoNovo = cashbackSaldoNovo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  //retorna um objeto com todos os valores calculados
  return {
    "Valor Resgatado": valorResgate,
    "A pagar": valorCompra,
    "Cashback Gerado": valorCashback,
    "Saldo de Cashback": cashbackSaldoNovo,
  };
}

const PagesController = {
  // ------------------------------------------- GET ----------------------------------
  showIndex: async (req, res) => {
    //checa conexão com banco de dados
    try {
      porcentagem = await buscaPorcento();
      console.log(porcentagem);
      return res.render("index");
    } catch (error) {
      return res.redirect("erro");
    }
  },
  showErro: async (req, res) => {
    return res.render("erro");
  },
  showCadastro: async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let erro;
    return res.render("cadastro", { erro, id });
  },
  showLoginAdm: async (req, res) => {
    return res.render("login-adm");
  },
  showLoginLoja: async (req, res) => {
    return res.render("login-loja");
  },
  showAdm: async (req, res) => {
    const idLojaCookie = req.cookies.idLoja;
    const usuarios = await Usuarios.findAll();
    const totalUsuarios = await Cashback.count({
      where: { lojas_id: idLojaCookie },
    });
    const totalCadastrados = await sequelize
      .query(
        "SELECT COUNT(*) AS total FROM usuarios LEFT OUTER JOIN cashback ON usuarios.id = cashback.usuarios_id WHERE (cashback.lojas_id = 1) AND (cpf IS NOT NULL)",
        {
          type: QueryTypes.SELECT,
        }
      )
      .then((result) => result[0].total);
    console.log(totalUsuarios);
    console.log(totalCadastrados);

    return res.render("adm", { usuarios, totalUsuarios, totalCadastrados });
  },
  showFinalizado: async (req, res) => {
    return res.render("finalizado");
  },
  showAcumular: async (req, res) => {
    return res.render("acumular");
  },
  ShowResgatar: async (req, res) => {
    let erro;
    let valor;
    let resultado;
    return res.render("resgatar", { erro, valor, resultado });
  },
  showConsultar: async (req, res) => {
    let usuario;
    let erro;
    return res.render("consultar", { erro, usuario });
  },

  // ----------------------------------- POST ------------------------------

  storeAcumular: async (req, res) => {
    //pega os valores e trata
    const valorCompra = parseFloat(
      req.body.valorCompra.replace(/\./g, "").replace(",", ".")
    );

    const telefone = req.body.telefone.replace(new RegExp("[^0-9]", "g"), "");

    const usuario = await buscarUsuario(telefone, true);

    await AcumularCompras(await usuario, valorCompra);

    res.redirect("/");
  },
  storeResgatar: async (req, res) => {
    const valorCompra = parseFloat(
      req.body.valorCompra.replace(/\./g, "").replace(",", ".")
    );

    const telefone = req.body.telefone.replace(new RegExp("[^0-9]", "g"), "");

    const usuario = await buscarUsuario(telefone, true);

    let valor;
    let erro;
    let resultado;

    if (usuario == null) {
      erro = "Este usuário não existe";
      res.render("resgatar", { erro, resultado });
    } else if (usuario.cpf == null) {
      erro = "Este usuário não completou o cadastro";
      res.render("resgatar", { erro, resultado });
    } else if (usuario.saldo_cashback == 0) {
      erro = "O saldo deste usuário é R$0,00";
      res.render("resgatar", { erro, resultado });
    } else {
      resultado = await ResgatarCompras(await usuario, valorCompra);
    }

    res.render("resgatar", { erro, resultado });
  },
  storeConsultar: async (req, res) => {
    //pega o telefone e trata o dado
    let telefone = req.body.telefone;
    telefone = telefone.replace(new RegExp("[^0-9]", "g"), "");
    usuario = await buscarUsuario(telefone);
    let erro = "";
    if (usuario == null) {
      erro = "Este usuário não existe";
      res.render("consultar", { erro });
    } else {
      res.render("consultar", { erro, usuario: usuario });
    }
  },
  storeForm: async (req, res) => {
    let id = req.params.id;
    console.log(id);

    //tratando dados
    let data = req.body.dataNascimento;
    let partesData = data.split("/");
    let dataFormatada =
      partesData[2] + "-" + partesData[1] + "-" + partesData[0];

    const telefone = req.body.telefone.replace(new RegExp("[^0-9]", "g"), "");

    let cpf = req.body.cpf.replace(new RegExp("[^0-9]", "g"), "");

    //encontra usuário
    const usuario = await buscarUsuario(telefone);

    console.log(cpf);
    console.log(usuario);

    //se o usuário não existe
    if (usuario == null) {
      erro = "Este telefone não é o mesmo que foi cadastrado na loja";
      res.render("cadastro", { erro });
    }
    //se já cadastrou
    else if (usuario.cpf !== null) {
      erro = "Já existe um usuário cadastrado com este CPF";
      res.render("cadastro", { erro });
    } else {
      await Usuarios.update(
        {
          nome: req.body.nome,
          data_nascimento: dataFormatada,
          telefone: telefone,
          cpf: cpf,
          sexo: req.body.sexo,
          email: req.body.email,
          avaliacao_loja: req.body.rating,
        },
        {
          where: {
            id: usuario.id,
          },
        }
      );

      res.redirect("finalizado");
    }
  },
  AdmAuth: async (req, res) => {
    const { email, senha } = req.body;

    const login = await buscarLogin(email, senha);

    const validaSenha = await bcrypt.compare(senha, login.senha);

    if (validaSenha) {
      req.session.loginAdm = true;
      res.cookie("idLoja", login.lojas_id);
      res.redirect("/adm/home");
    } else {
      console.log("Usuário errado");
    }
  },
  LojistaAuth: async (req, res) => {
    const { email, senha } = req.body;

    const loginLojista = await buscarLogin(email, senha);

    const validaSenha = await bcrypt.compare(senha, loginLojista.senha);

    if (validaSenha) {
      req.session.loginLoja = true;
      res.cookie("idLoja", loginLojista.lojas_id);
      res.redirect("/");
    } else {
      console.log("Usuário errado");
    }
  }
};

module.exports = PagesController;
